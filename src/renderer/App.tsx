import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import GameScene from "./game/GameScene";

const App: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS, // Fix: Force Canvas for Linux compatibility
      width: 800,
      height: 600,
      parent: "phaser-container",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 }, // Top-down game, so no gravity
          debug: true,
        },
      },
      scene: [GameScene],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      // Cleanup if needed (rare in this app structure)
      // gameRef.current?.destroy(true);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Phaser Game Container */}
      <div id="phaser-container" />

      {/* UI Overlay (Optional) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          padding: "10px",
        }}
      >
        <h1 style={{ color: "white", margin: 0, opacity: 0.5 }}>UI Overlay</h1>
      </div>
    </div>
  );
};

export default App;
