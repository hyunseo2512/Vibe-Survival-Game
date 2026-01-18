import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  private target: Phaser.Physics.Arcade.Sprite;
  private speed: number = 100;
  private hp: number = 10;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Phaser.Physics.Arcade.Sprite,
  ) {
    super(scene, x, y, "enemy_rect"); // We will create this texture in GameScene
    this.target = target;

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics settings
    this.setCollideWorldBounds(true);
    this.setBounce(1);
  }

  update() {
    if (!this.active || !this.target.active) return;

    // Chase the target (Player)
    this.scene.physics.moveToObject(this, this.target, this.speed);
  }

  takeDamage(amount: number) {
    this.hp -= amount;
    // Flash effect
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => this.clearTint());

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.destroy();
    // Notify scene to give XP
    if (this.scene && "enemyKilled" in this.scene) {
      (this.scene as any).enemyKilled();
    }
  }
}
