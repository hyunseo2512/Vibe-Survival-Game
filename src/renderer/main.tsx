import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // StrictMode might cause double render in dev, which creates two Phaser instances.
  // We can keep it or remove it. For vibe coding simplicity, let's keep it but handle it in App.tsx
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
