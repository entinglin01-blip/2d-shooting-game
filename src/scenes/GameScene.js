import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    this.score = 0;
    this.level = 1;
    this.health = 100;
    this.enemiesDefeated = 0;
    this.enemiesNeeded = 5 + this.level * 2;
  }

  create() {
    const { width, height } = this.cameras.main;

    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0a);

    // 網格背景
    this.drawGrid();

    // 創建玩家
    this.player = this.add.rectangle(width / 2, height - 50, 40, 40, 0x00ff00);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // 創建子彈組
    this.bullets = this.physics.add.group();

    // 創建敵人組
    this.enemies = this.physics.add.group();

    // 碰撞檢測
    this.physics.add.overlap(this.bullets, this.enemies, this.onBulletHitEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.onPlayerHitEnemy, null, this);

    // UI文本
    this.scoreText = this.add.text(16, 16, `分數: ${this.score}`, {
      fontSize: '20px',
      fill: '#ffff00',
    });

    this.levelText = this.add.text(width - 150, 16, `關卡: ${this.level}`, {
      fontSize: '20px',
      fill: '#00ff00',
    });

    this.healthText = this.add.text(16, 50, `血量: ${this.health}`, {
      fontSize: '20px',
      fill: '#ff0000',
    });

    this.enemyCountText = this.add.text(width - 150, 50, `敵人: ${this.enemiesDefeated}/${this.enemiesNeeded}`, {
      fontSize: '20px',
      fill: '#ff00ff',
    });

    // 鍵盤控制
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    // 鼠標射擊
    this.input.on('pointerdown', () => this.shoot());

    // 定期生成敵人
    this.time.addRepeatedEvent({
      delay: 1000,
      callback: () => this.spawnEnemy(),
      loop: true,
    });
  }

  drawGrid() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.lineStyle(1, 0x333333, 0.5);
    const gridSize = 40;
    const { width, height } = this.cameras.main;

    for (let x = 0; x < width; x += gridSize) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }
    graphics.strokePath();
  }

  update() {
    const speed = 200;

    // 玩家移動
    if (this.keys.up.isDown || this.keys.w.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.keys.down.isDown || this.keys.s.isDown) {
      this.player.body.setVelocityY(speed);
    } else {
      this.player.body.setVelocityY(0);
    }

    if (this.keys.left.isDown || this.keys.a.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.keys.right.isDown || this.keys.d.isDown) {
      this.player.body.setVelocityX(speed);
    } else {
      this.player.body.setVelocityX(0);
    }

    // 空格射擊
    if (this.keys.space.isDown && !this.lastShootTime) {
      this.shoot();
      this.lastShootTime = true;
      this.time.delayedCall(100, () => {
        this.lastShootTime = false;
      });
    }

    // 移除超出邊界的子彈
    this.bullets.children.entries.forEach((bullet) => {
      if (
        bullet.x < 0 ||
        bullet.x > this.cameras.main.width ||
        bullet.y < 0 ||
        bullet.y > this.cameras.main.height
      ) {
        bullet.destroy();
      }
    });
  }

  shoot() {
    const bullet = this.bullets.create(this.player.x, this.player.y, null);
    const graphics = this.make.graphics({ x: this.player.x, y: this.player.y, add: true });
    graphics.fillStyle(0xffff00);
    graphics.fillCircle(0, 0, 4);
    graphics.generateTexture('bulletTexture', 8, 8);
    graphics.destroy();

    bullet.setTexture('bulletTexture');
    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.input.activePointer.x,
      this.input.activePointer.y
    );
    this.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), 400, bullet.body.velocity);
  }

  spawnEnemy() {
    const { width, height } = this.cameras.main;
    let x, y;

    const side = Phaser.Math.Between(0, 3);
    switch (side) {
      case 0:
        x = Phaser.Math.Between(0, width);
        y = -20;
        break;
      case 1:
        x = width + 20;
        y = Phaser.Math.Between(0, height);
        break;
      case 2:
        x = Phaser.Math.Between(0, width);
        y = height + 20;
        break;
      case 3:
        x = -20;
        y = Phaser.Math.Between(0, height);
        break;
    }

    const enemy = this.add.rectangle(x, y, 30, 30, 0xff0000);
    this.physics.add.existing(enemy);

    const angle = Phaser.Math.Angle.Between(x, y, this.player.x, this.player.y);
    this.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), 100 + this.level * 20, enemy.body.velocity);

    this.enemies.add(enemy);
  }

  onBulletHitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    this.score += 10 * this.level;
    this.enemiesDefeated++;
    this.scoreText.setText(`分數: ${this.score}`);
    this.enemyCountText.setText(`敵人: ${this.enemiesDefeated}/${this.enemiesNeeded}`);

    if (this.enemiesDefeated >= this.enemiesNeeded) {
      this.nextLevel();
    }
  }

  onPlayerHitEnemy(player, enemy) {
    this.health -= 10;
    this.healthText.setText(`血量: ${this.health}`);

    if (this.health <= 0) {
      this.scene.start('GameOverScene', { score: this.score, level: this.level });
    }
  }

  nextLevel() {
    this.level++;
    this.enemiesDefeated = 0;
    this.enemiesNeeded = 5 + this.level * 2;
    this.health = Math.min(100, this.health + 20);

    this.levelText.setText(`關卡: ${this.level}`);
    this.healthText.setText(`血量: ${this.health}`);
    this.enemyCountText.setText(`敵人: ${this.enemiesDefeated}/${this.enemiesNeeded}`);

    // 清除所有敵人和子彈
    this.enemies.clear(true, true);
    this.bullets.clear(true, true);
  }
}
