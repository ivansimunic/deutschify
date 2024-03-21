import { useState, useEffect } from "react";

import pb from "../pocketbaseClient";
import { FSRS, Rating, generatorParameters } from "ts-fsrs";
import IconButton from "./IconButton";

export default function Study({ setFrame }) {
  const [term, setTerm] = useState("");
  const [writable, setWritable] = useState(true);
  const [correct, setCorrect] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [toStudy, setToStudy] = useState(null);
  const [textColor, setTextColor] = useState("wood")
  
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
    if (writable) setTextColor("wood")
    else {
      if (correct) setTextColor("correct")
      else setTextColor("incorrect")
    }
    console.log('new text color:', textColor)
    
   }, [correct, writable])

  useEffect(() => {
    console.log("The flashcards have changed");

    if (flashcards.length > 0) {
      console.log(
        Date.parse(flashcards[0].dueDate),
        Date.now(),
        Date.parse(flashcards[0].dueDate) < Date.now(),
      );
      if (Date.parse(flashcards[0].dueDate) < Date.now()) {
        setToStudy(flashcards[0]);
      } else setToStudy(null);
    }
  }, [flashcards]);

  function check(event) {
    if (event.key === "Enter") {
      
      setWritable(false);
      console.log("writable", writable)
      console.log('WTF i just fucking set it to false')
      
      
      setCorrect(term === toStudy.back);
      setTerm(toStudy.back);
      console.log("term: ", term);
      playAudio();
      console.log("writable", writable)
    }
  }

  function practice() {
    setTerm("");
    setWritable(true);

    const newSrsData = f.repeat(toStudy.srsData, new Date())[
      correct ? Rating.Good : Rating.Again
    ].card;

    let fc = flashcards.map((fc) => fc);
    fc[0].srsData = newSrsData;
    fc[0].dueDate = newSrsData.due;

    console.log(newSrsData);

    pb.collection("flashcards").update(fc[0].id, fc[0]);

    fc.sort((a, b) => (Date.parse(a.dueDate) > Date.parse(b.dueDate) ? 1 : -1));
    setFlashcards(fc);

    console.log(flashcards);
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
        {!writable ? (
          <button
            onClick={practice}
            className="absolute right-0 m-1 flex h-9 w-9 items-center rounded-full bg-paper"
          >
            <span className="i-icon-park-outline-right h-7 w-7 bg-wood pl-9" />
          </button>
        ) : (
          <></>
        )}
        <input
          className=" w-full rounded-full bg-paper p-2 text-center text-xl outline-0 text-wood"
          type="text"
          value={term}
          onKeyDown={check}
          onChange={({ target }) => setTerm(target.value)}
        />
      </div>
      {!writable && (
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
