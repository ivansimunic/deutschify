import { useState, useEffect, useRef } from "react";

import pb from "../pocketbaseClient";
import { FSRS, Rating, generatorParameters } from "ts-fsrs";
import IconButton from "./IconButton";

export default function Study({ setFrame }) {
  const [term, setTerm] = useState("");
  const [correct, setCorrect] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [toStudy, setToStudy] = useState(null);
  
  const [failed, setFailed] = useState(false)
  const [state, setState] = useState("trying")//trying, solutionIncorrect, solutionCorrect
  
  const inputRef = useRef()
  
  const [textColor, setTextColor] = useState("#1A1818")
  /*
    wood: "#1A1818",
    paper: "#F4E5CE",
    correct: "#00E6AC",
    incorrect: "#FF4D4D"
  */
  
  const params = generatorParameters({ maximum_interval: 1000 });
  const f = new FSRS(params);

  useEffect(() => {
    async function getEm() {
      const f = await pb.collection("flashcards").getFullList({
        sort: "dueDate",
      });
      setFlashcards(f);
      console.log(f);
    }
    getEm();
  }, []);
  
  useEffect(() => { 
    if (state === "trying") setTextColor("#1A1818")
    if (state === "solutionCorrect") setTextColor("#00E6AC")
    if (state === "solutionIncorrect") setTextColor("#FF4D4D")
  }, [state])


  useEffect(() => {
    console.log("The flashcards have changed");
    setFailed(false)
    if (flashcards.length > 0) {
      console.log(
        Date.parse(flashcards[0].dueDate),
        Date.now(),
        Date.parse(flashcards[0].dueDate) < Date.now(),
      );
      if (Date.parse(flashcards[0].dueDate) < Date.now()) {
        setToStudy(flashcards[0])
      } else setToStudy(null);
    }
  }, [flashcards]);
  
  
  function handleInput({ target }) { 
    console.log(target.value)
    setTerm(target.value)
    
    
  }


  function check(event) {
    if (event.key === "Enter") {
      setCorrect(term === toStudy.back);
      if (term === toStudy.back) {
        setState("solutionCorrect")
        inputRef.current.blur()
      }
      else {
        setState("solutionIncorrect")
        setFailed(true)
        inputRef.current.blur()
        setTerm(toStudy.back)
      }
      console.log("term: ", term);
      playAudio();
    }
  }

  function practice() {
    setTerm("");

    const newSrsData = f.repeat(toStudy.srsData, new Date())[
      failed ? Rating.Again : Rating.Good
    ].card;

    let fc = flashcards.map((fc) => fc);
    fc[0].srsData = newSrsData;
    fc[0].dueDate = newSrsData.due;

    console.log(newSrsData);

    pb.collection("flashcards").update(fc[0].id, fc[0]);

    fc.sort((a, b) => (Date.parse(a.dueDate) > Date.parse(b.dueDate) ? 1 : -1));
    setFlashcards(fc);
    setState("trying")
    console.log(flashcards);
  }
  
  function handleOnFocus() { 
    if (state === "solutionIncorrect") {
      setTerm("")
      setState("trying")
    } else if (state === "solutionCorrect") { 
      practice()
    }
      
  }

  function playAudio() {
    const a = new Audio(toStudy.audio);
    a.play();
  }

  if (!toStudy)
    return (
      <div className="flex h-full flex-col items-center">
        <p className="mt-[50%] text-3xl">Nothing to study.</p>
        <button className="mt-10" onClick={() => setFrame("add")}>
          <span className="i-carbon-add-filled h-10 w-10 bg-paper" />
        </button>
      </div>
    );

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <p className="text-center text-2xl">{toStudy.meanings}</p>
        <p className="mt-2 text-center">{toStudy.type}</p>
      </div>
      <div className="m-14 relative  w-8/12">
        <input
          placeholder="Answer..."
          className="w-full rounded-full bg-paper p-2 text-center text-xl outline-0 text-wood"
          style={{ color: `${textColor}` }}
          ref={inputRef}
          type="text"
          value={term}
          onKeyDown={check}
          onChange={handleInput}
          onFocus={handleOnFocus}
        />
      </div>

      
      {state !== "trying" && (
        <div className="flex flex-col items-center">
          {toStudy.audio && <IconButton icon="i-lets-icons-sound-max-fill" onClick={ playAudio } />}
          <div className="flex h-96 flex-col items-center overflow-y-auto">
            {toStudy.examples.map((e) => (
              <div
                className="m-4 flex flex-col items-center text-center"
                key={e.phrase}
              >
                <p className="text-lg">{e.phrase}</p>
                <p>{e.translation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
