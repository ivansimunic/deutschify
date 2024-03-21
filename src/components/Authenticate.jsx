import { useState } from "react";

import pb from "../pocketbaseClient";
import Button from "./IconButton";

export default function Authenticate() {
  const [symbolIndex, setSymbolindex] = useState(0);

  const symbols = [
    "i-ri-beer-fill",
    "i-mdi-pretzel",
    "i-mdi-sausage",
    "i-icon-park-solid-eagle",
    "i-game-icons-iron-cross",
    "i-game-icons-oak-leaf",
  ];

  function switchSymbol() {
    setSymbolindex((symbolIndex + 1) % 6);
  }

  async function withGoogle() {
    await pb.collection("users").authWithOAuth2({ provider: "google" });
    location.reload();
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-between bg-wood text-paper">
      <div className="flex w-full justify-between p-3">
        <p className="text-lg">Deutschify</p>
        <Button icon={symbols[symbolIndex]} onClick={switchSymbol}></Button>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-3xl">Learn German</p>
        <p className="text-3xl">on-the-go</p>
      </div>
      <div className="flex flex-col items-center text-lg">
        <p>Add words as you encounter them in life.</p>
        <p>Open the app in chunks of free time.</p>
      </div>
      <p className="text-lg">The system takes care of the rest</p>
      <button
        onClick={withGoogle}
        className="m-24 p-1 h-10 flex items-center justify-center rounded-full bg-paper text-sm text-wood"
      >
        <span className="i-mingcute-google-fill h-5 w-5 bg-wood pl-9" />
        <p className="pb-2 pr-4 pt-2">Continue with Google</p>
      </button>
    </div>
  );
}
