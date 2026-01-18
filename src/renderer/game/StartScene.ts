import Phaser from "phaser";
import Store from "electron-store";
const store = new Store();

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    // 1. Background
    this.add.rectangle(400, 300, 800, 600, 0x111111);

    // 2. Title
    this.add
      .text(400, 150, "VIBE SURVIVAL", {
        fontSize: "64px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // 3. High Score
    const highScore = store.get("highScore", 0);
    this.add
      .text(400, 250, `🏆 HIGH SCORE: ${highScore}`, {
        fontSize: "24px",
        color: "#ffd700",
      })
      .setOrigin(0.5);

    // 4. Start Button
    const startBtn = this.add
      .text(400, 400, "GAME START", {
        fontSize: "32px",
        backgroundColor: "#00ff00",
        color: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Button Events
    startBtn.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    startBtn.on("pointerover", () => startBtn.setScale(1.1));
    startBtn.on("pointerout", () => startBtn.setScale(1.0));

    // Instructions
    this.add
      .text(400, 500, "WASD to Move | Auto Attack", {
        fontSize: "16px",
        color: "#888888",
      })
      .setOrigin(0.5);
  }
}
