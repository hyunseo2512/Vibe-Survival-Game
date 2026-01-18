import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite; // '!' means trust me, it will be there
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("GameScene");
  }

  preload() {
    // For vibe coding, we'll use a placeholder rectangle if no asset is found
    // But let's try to load a placeholder from online or just generate a texture
  }

  create() {
    // 1. Create a simple graphic texture for player (Red Box)
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xff0000);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture("player_rect", 32, 32);

    // 2. Add Player
    this.player = this.physics.add.sprite(400, 300, "player_rect");
    this.player.setCollideWorldBounds(true);

    // 3. Add Controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // 4. Add Text
    this.add.text(10, 10, "Vibe Survival: Prototype", {
      fontSize: "20px",
      color: "#ffffff",
    });
  }

  update() {
    if (!this.cursors) return;

    // Reset velocity
    this.player.setVelocity(0);

    const speed = 200;

    // Movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }
  }
}
