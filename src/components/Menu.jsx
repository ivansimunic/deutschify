import { useState } from "react";
import pb from "../pocketbaseClient";

export default function Menu({ frame, setFrame }) {
  const [expanded, setExpanded] = useState(false);
  
  function logout() {
    pb.authStore.clear();
    location.reload();
  }
  
  function switchFrame(frame) {
    setExpanded(false)
    setFrame(frame)
  }

  if (expanded)
    return (
      <div className="flex flex-col space-y-4">
        <button onClick={() => setExpanded(false)}>
          <span className="i-flowbite-close-outline h-8 w-8 bg-paper" />
        </button>
        <button onClick={() => switchFrame("add")}>
          <span className="i-carbon-add-filled h-6 w-6 bg-paper" />
        </button>
        <button onClick={() => switchFrame("study")}>
          <span className="i-ion-book h-6 w-6 bg-paper" />
        </button>
        <button onClick={logout}>
          <span className="i-majesticons-logout h-6 w-6 bg-paper" />
        </button>
      </div>
    );
  else
    return (
      <div>
        <button onClick={() => setExpanded(true)}>
          <span className="i-bytesize-menu h-8 w-8 bg-paper" />
        </button>
      </div>
    );
}
