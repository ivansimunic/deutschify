import { useState, useEffect, useRef } from "react";

import pb from "../pocketbaseClient";
import { FSRS, Rating, generatorParameters } from "ts-fsrs";
import IconButton from "./IconButton";
import { useKeyDown } from "../useKeyDown";

export default function Study({ setFrame, flashcards, setFlashcards }) {
  const [term, setTerm] = useState("");
  const [toStudy, setToStudy] = useState(null);
  const [readyForNext, setReadyForNext] = useState(false)
  const [failed, setFailed] = useState(false)
  const [state, setState] = useState("trying")//trying, solutionIncorrect, solutionCorrect
  
  const inputRef = useRef()
  
  const [bgColor, setBgColor] = useState("#F4E5CE")

  
  const params = generatorParameters({ maximum_interval: 1000 });
  const f = new FSRS(params);


  
  useEffect(() => { 
    if (state === "trying") setBgColor("#F4E5CE")
    if (state === "solutionCorrect") setBgColor("#29AB87")
    if (state === "solutionIncorrect") setBgColor("#CD5C5C")
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
  
  
  useKeyDown(() => {
    console.log("rfn", readyForNext)
    if (readyForNext)
      next()
    
  }, ["Enter"])
  
  function handleInput({ target }) { 
    console.log(target.value)
    setTerm(target.value)
    
    
  }
  
  function getSolution() {
    
    if (toStudy.type.slice(0,4) === "noun")
      console.log('NOUNN')
      
      switch (toStudy.type.slice(6)) {
        case 'masculine':
          return `der ${toStudy.back}`
        case 'feminine':
          return `die ${toStudy.back}`
        case 'neuter':
          return `das ${toStudy.back}`
        case 'plural':
          return `die ${toStudy.back}`
      }
    return toStudy.back
  }


  function check(event) {
    if (event.key === "Enter") {
      if (term === getSolution()) {
        setState("solutionCorrect")
        inputRef.current.blur()
      }
      else {
        setState("solutionIncorrect")
        setFailed(true)
        inputRef.current.blur()
        setTerm(getSolution())
      }
      setTimeout(() => {
        setReadyForNext(true)
      }, 100)
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
  
  function next() { 
    if (state === "solutionIncorrect") {
      setTerm("")
      setState("trying")
    } else if (state === "solutionCorrect") { 
      practice()
    }
    setReadyForNext(false)
    
    inputRef.current.focus()
      
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
          style={{ 'background-color': `${bgColor}` }}
          ref={inputRef}
          type="text"
          value={term}
          onKeyDown={check}
          onChange={handleInput}
          onFocus={next}
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
