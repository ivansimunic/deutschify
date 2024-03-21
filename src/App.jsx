import { useState } from "react";

import TopBar from "./components/TopBar";
import Study from "./components/Study";
import Add from "./components/Add";
import Authenticate from "./components/Authenticate";

import pb from "./pocketbaseClient";

export default function App() {
  const [frame, setFrame] = useState("study"); //add or study

  if (!pb.authStore.isValid) return <Authenticate />;

  if (frame === "add")
    return (
      <div className="h-full min-h-screen w-screen bg-wood text-paper">
        <TopBar frame={frame} setFrame={setFrame} />
        <Add />
      </div>
    );

  if (frame === "study")
    return (
      <div className="h-full min-h-screen w-screen bg-wood text-paper">
        <TopBar frame={frame} setFrame={setFrame} />
        <Study setFrame={setFrame} />
      </div>
    );
}
