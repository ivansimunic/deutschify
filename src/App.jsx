import { useState, useEffect } from "react";

import TopBar from "./components/TopBar";
import Study from "./components/Study";
import Add from "./components/Add";
import Authenticate from "./components/Authenticate";

import pb from "./pocketbaseClient";

export default function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [frame, setFrame] = useState("study"); //add or study

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
  
  if (!pb.authStore.isValid) return <Authenticate />;

  if (frame === "add")
    return (
      <div className="h-full min-h-screen w-screen bg-wood text-paper">
        <TopBar frame={frame} setFrame={setFrame} />
        <Add flashcards={flashcards} setFlashcards={ setFlashcards } />
      </div>
    );

  if (frame === "study")
    return (
      <div className="h-full min-h-screen w-screen bg-wood text-paper">
        <TopBar frame={frame} setFrame={setFrame} />
        <Study flashcards={flashcards} setFlashcards={ setFlashcards } setFrame={setFrame} />
      </div>
    );
}
