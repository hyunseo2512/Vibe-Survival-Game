import Enemy from "./Enemy";
import Store from "electron-store";
const store = new Store();

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private enemies!: Phaser.Physics.Arcade.Group;

  // Game Stats
  private hp: number = 100;
  private maxHp: number = 100;
  private xp: number = 0;
  private level: number = 1;
  private score: number = 0;
  private nextLevelXp: number = 100;

  // UI
  private scoreText!: Phaser.GameObjects.Text;
  private hpText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;

  private lastFired: number = 0;
  private isGameOver: boolean = false;

  constructor() {
    super("GameScene");
  }

  preload() {
    // Assets are generated in create()
  }

  create() {
    this.isGameOver = false;
    this.hp = 100;
    this.xp = 0;
    this.level = 1;
    this.score = 0;
    this.nextLevelXp = 100;

    // 1. Textures (Square placeholders)
    this.createTexture("player_rect", 0x00ff00); // Green Player
    this.createTexture("enemy_rect", 0xff0000); // Red Enemy
    this.createTexture("bullet_rect", 0xffff00); // Yellow Bullet

    // 2. Player
    this.player = this.physics.add.sprite(400, 300, "player_rect");
    this.player.setCollideWorldBounds(true);
    // this.cameras.main.startFollow(this.player); // Camera follow

    // 3. Enemies Group
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true, // Auto update children
    });

    // 4. Physics Collisions
    this.physics.add.collider(
      this.player,
      this.enemies,
      this.handlePlayerEnemyCollision,
      undefined,
      this,
    );

    // 5. Controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // 6. Spawn Timer (Every 1s)
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    // 7. UI Text
    this.scoreText = this.add.text(10, 10, "Score: 0", {
      fontSize: "20px",
      color: "#fff",
    });
    this.hpText = this.add.text(10, 40, "HP: 100", {
      fontSize: "20px",
      color: "#ff0000",
    });
    this.levelText = this.add.text(10, 70, "LV: 1", {
      fontSize: "20px",
      color: "#00ff00",
    });
  }

  update(time: number, delta: number) {
    if (this.isGameOver || !this.cursors || !this.player) return;

    // --- Player Movement ---
    this.player.setVelocity(0);
    const speed = 200;

    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
    else if (this.cursors.right.isDown) this.player.setVelocityX(speed);

    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down.isDown) this.player.setVelocityY(speed);

    // --- Auto Attack (Nearest Enemy) ---
    this.autoAttack(time);
  }

  // --- Helper Methods ---

  createTexture(key: string, color: number) {
    if (this.textures.exists(key)) return;
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(color);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture(key, 32, 32);
  }

  spawnEnemy() {
    if (this.isGameOver) return;
    const x = Phaser.Math.Between(0, 800);
    const y = Phaser.Math.Between(0, 600);
    // Don't spawn too close to player
    if (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < 200)
      return;

    const enemy = new Enemy(this, x, y, this.player);
    this.enemies.add(enemy);
  }

  handlePlayerEnemyCollision(obj1: any, obj2: any) {
    if (this.isGameOver) return;
    const player = obj1 as Phaser.Physics.Arcade.Sprite;
    const enemy = obj2 as Enemy;

    // Knockback
    const angle = Phaser.Math.Angle.Between(
      enemy.x,
      enemy.y,
      player.x,
      player.y,
    );
    player.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400);

    // Simple HP logic later
    this.takeDamage(10);
  }

  takeDamage(amount: number) {
    this.hp -= amount;
    this.hpText.setText(`HP: ${this.hp}`);
    this.player.setTint(0xff0000);
    this.time.delayedCall(100, () => this.player.clearTint());

    if (this.hp <= 0) {
      this.gameOver();
    }
  }

  addXp(amount: number) {
    this.xp += amount;
    this.score += amount * 10;

    // Level Up Logic
    if (this.xp >= this.nextLevelXp) {
      this.level++;
      this.xp -= this.nextLevelXp;
      this.nextLevelXp = Math.floor(this.nextLevelXp * 1.2);
      this.hp = this.maxHp; // Full Heal
      this.player.setScale(1 + this.level * 0.1); // Grow size!

      // Visual Feedback
      const txt = this.add
        .text(this.player.x, this.player.y - 50, "LEVEL UP!", {
          fontSize: "30px",
          color: "#ffd700",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.tweens.add({
        targets: txt,
        y: txt.y - 50,
        alpha: 0,
        duration: 1000,
        onComplete: () => txt.destroy(),
      });
    }

    this.updateUI();
  }

  updateUI() {
    this.scoreText.setText(`Score: ${this.score}`);
    this.hpText.setText(`HP: ${this.hp}`);
    this.levelText.setText(
      `LV: ${this.level} (${this.xp}/${this.nextLevelXp})`,
    );
  }

  autoAttack(time: number) {
    if (time < this.lastFired + 500) return; // Fire rate: 0.5s

    // Find nearest enemy
    let nearest: Enemy | null = null;
    let minDist = 300; // Attack range

    this.enemies.getChildren().forEach((child) => {
      const enemy = child as Enemy;
      if (enemy.active) {
        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y,
        );
        if (dist < minDist) {
          minDist = dist;
          nearest = enemy;
        }
      }
    });

    if (nearest) {
      this.fireBullet(nearest);
      this.lastFired = time;
    }
  }

  fireBullet(target: Enemy) {
    const bullet = this.physics.add.sprite(
      this.player.x,
      this.player.y,
      "bullet_rect",
    );
    bullet.setScale(0.5);
    this.physics.moveToObject(bullet, target, 400);

    // Bullet kills enemy on overlap
    this.physics.add.overlap(bullet, target, (b, e) => {
      (e as Enemy).takeDamage(10);
      b.destroy();
      // XP Logic here (simplified: kill check is inside enemy?)
      // Actually, let's trigger XP add here if enemy dies
      // Ideally Enemy should emit event, but direct call is easier for now
      if (!(e as Enemy).active) {
        // Need to check if it died *just now*.
        // Checking Enemy.hp locally or make Enemy call scene back.
      }
    });

    // Destroy bullet after 1s
    this.time.delayedCall(1000, () => {
      if (bullet.active) bullet.destroy();
    });
  }

  // Configured in Enemy.ts to call this
  enemyKilled() {
    this.addXp(20);
  }

  gameOver() {
    this.isGameOver = true;
    this.physics.pause();
    this.player.setTint(0x555555);

    // Save Score
    const currentHigh = store.get("highScore", 0);
    if (this.score > currentHigh) {
      store.set("highScore", this.score);
    }

    this.add
      .text(400, 300, "GAME OVER", {
        fontSize: "64px",
        color: "#ff0000",
        backgroundColor: "#000",
      })
      .setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.scene.start("StartScene");
    });
  }
}
