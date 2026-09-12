import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import PowerUp from '../entities/PowerUp';
import Boss from '../entities/Boss';
import SoundManager from '../utils/SoundManager';
import ParticleManager from '../utils/ParticleManager';
import AchievementManager from '../utils/AchievementManager';
import PlayerData from '../utils/PlayerData';
import { CONFIG, ENEMY_CONFIG, WEAPON_CONFIG } from '../config/GameConfig';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.difficulty = data.difficulty || 'NORMAL';
    this.difficultyMultiplier = CONFIG.DIFFICULTIES[this.difficulty]?.multiplier || 1.0;
  }

  create() {
    const { width, height } = this.cameras.main;

    // 初始化管理器
    this.playerData = new PlayerData();
    this.soundManager = new SoundManager(this);
    this.particleManager = new ParticleManager(this);
    this.achievementManager = new AchievementManager(this, this.playerData);

    // 游戏状态
    this.score = 0;
    this.level = 1;
    this.enemiesDefeated = 0;
    this.enemiesNeeded = 5 + this.level * 2;
    this.totalEnemiesDefeated = 0;
    this.isPaused = false;
    this.boss = null;
    this.noDamageThisLevel = true;

    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0a);
    this.drawGrid();

    // 创建玩家
    this.player = new Player(this, width / 2, height - 50);

    // 创建物理组
    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.powerups = this.physics.add.group();

    // 碰撞检测
    this.physics.add.overlap(this.bullets, this.enemies, this.onBulletHitEnemy, null, this);
    this.physics.add.overlap(this.player.sprite, this.enemies, this.onPlayerHitEnemy, null, this);
    this.physics.add.overlap(this.player.sprite, this.enemyBullets, this.onPlayerHitByBullet, null, this);
    this.physics.add.overlap(this.player.sprite, this.powerups, this.onPlayerCollectPowerup, null, this);

    if (this.boss) {
      this.physics.add.overlap(this.bullets, this.boss.sprite, this.onBulletHitBoss, null, this);
    }

    // UI
    this.createUI();

    // 键盘输入
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
      p: Phaser.Input.Keyboard.KeyCodes.P,
      e: Phaser.Input.Keyboard.KeyCodes.E,
      r: Phaser.Input.Keyboard.KeyCodes.R,
      t: Phaser.Input.Keyboard.KeyCodes.T,
      y: Phaser.Input.Keyboard.KeyCodes.Y,
      u: Phaser.Input.Keyboard.KeyCodes.U,
    });

    // 鼠标射击
    this.input.on('pointerdown', () => this.shoot());

    // 定期生成敌人
    this.spawnTimer = this.time.addRepeatedEvent({
      delay: 1000 / this.difficultyMultiplier,
      callback: () => this.spawnEnemy(),
      loop: true,
    });
  }

  createUI() {
    const { width, height } = this.cameras.main;

    this.scoreText = this.add.text(16, 16, `分数: ${this.score}`, {
      fontSize: '20px',
      fill: '#ffff00',
    }).setDepth(1000);

    this.levelText = this.add.text(width - 150, 16, `关卡: ${this.level}`, {
      fontSize: '20px',
      fill: '#00ff00',
    }).setDepth(1000);

    this.healthBar = this.add.rectangle(16, 60, 200, 20, 0x333333);
    this.healthFill = this.add.rectangle(16, 60, 200, 20, 0x00ff00);
    this.healthText = this.add.text(16, 60, `血量: ${this.player.health}/${this.player.maxHealth}`, {
      fontSize: '14px',
      fill: '#ffff00',
    }).setDepth(1000);

    this.shieldBar = this.add.rectangle(16, 90, 200, 10, 0x333333);
    this.shieldFill = this.add.rectangle(16, 90, this.player.shield * 4, 10, 0x00ffff);

    this.enemyCountText = this.add.text(width - 150, 50, `敌人: ${this.enemiesDefeated}/${this.enemiesNeeded}`, {
      fontSize: '16px',
      fill: '#ff00ff',
    }).setDepth(1000);

    this.weaponText = this.add.text(width - 150, 80, `武器: ${WEAPON_CONFIG[this.player.currentWeapon].name}`, {
      fontSize: '14px',
      fill: '#ffaa00',
    }).setDepth(1000);

    this.difficultyText = this.add.text(width / 2, 16, `难度: ${this.difficulty}`, {
      fontSize: '16px',
      fill: '#ff6600',
      align: 'center',
    }).setOrigin(0.5).setDepth(1000);

    this.pauseText = this.add.text(width / 2, height - 30, '按P暂停 | 按R切换武器', {
      fontSize: '14px',
      fill: '#999999',
      align: 'center',
    }).setOrigin(0.5).setDepth(1000);
  }

  drawGrid() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.lineStyle(1, 0x333333, 0.3);
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
    if (this.isPaused) return;

    // 更新玩家
    this.player.update(this.keys, this.input.activePointer);

    // 处理射击
    if (this.keys.space.isDown) {
      if (!this.lastShootTime) {
        this.shoot();
        this.lastShootTime = true;
        this.time.delayedCall(WEAPON_CONFIG[this.player.currentWeapon].fireRate, () => {
          this.lastShootTime = false;
        });
      }
    }

    // 切换武器
    if (this.keys.e.isDown && !this.lastWeaponSwitch) {
      this.switchWeapon();
      this.lastWeaponSwitch = true;
      this.time.delayedCall(200, () => {
        this.lastWeaponSwitch = false;
      });
    }

    // 暂停
    if (this.keys.p.isDown && !this.lastPausePress) {
      this.togglePause();
      this.lastPausePress = true;
      this.time.delayedCall(200, () => {
        this.lastPausePress = false;
      });
    }

    // 更新敌人
    this.enemies.children.entries.forEach((enemy) => {
      if (enemy.update) {
        enemy.update(this.player);
      }
      if (!enemy.isAlive()) {
        enemy.destroy();
      }
    });

    // 更新Boss
    if (this.boss && this.boss.isAlive()) {
      this.boss.update(this.player);
    }

    // 更新道具
    this.powerups.children.entries.forEach((powerup) => {
      if (powerup.update) {
        powerup.update();
      }
    });

    // 移除超出屏幕的子弹
    this.bullets.children.entries.forEach((bullet) => {
      if (bullet.x < 0 || bullet.x > this.cameras.main.width || bullet.y < 0 || bullet.y > this.cameras.main.height) {
        bullet.destroy();
      }
    });

    this.enemyBullets.children.entries.forEach((bullet) => {
      if (bullet.x < 0 || bullet.x > this.cameras.main.width || bullet.y < 0 || bullet.y > this.cameras.main.height) {
        bullet.destroy();
      }
    });

    // 更新UI
    this.updateUI();

    // 检查游戏结束
    if (this.player.health <= 0) {
      this.endGame();
    }
  }

  updateUI() {
    this.scoreText.setText(`分数: ${this.score}`);
    this.levelText.setText(`关卡: ${this.level}`);
    this.healthText.setText(`血量: ${this.player.health}/${this.player.maxHealth}`);
    this.healthFill.displayWidth = (this.player.health / this.player.maxHealth) * 200;
    this.shieldFill.displayWidth = Math.min(this.player.shield * 4, 200);
    this.enemyCountText.setText(`敌人: ${this.enemiesDefeated}/${this.enemiesNeeded}`);
    this.weaponText.setText(`武器: ${WEAPON_CONFIG[this.player.currentWeapon].name}`);
  }

  shoot() {
    this.soundManager.playShoot();
    const config = WEAPON_CONFIG[this.player.currentWeapon];
    const angle = Phaser.Math.Angle.Between(
      this.player.getX(),
      this.player.getY(),
      this.input.activePointer.x,
      this.input.activePointer.y
    );

    if (config.spread === 0) {
      this.createBullet(angle, config);
    } else {
      // 散射效果
      for (let i = -1; i <= 1; i++) {
        this.createBullet(angle + i * config.spread, config);
      }
    }
  }

  createBullet(angle, config) {
    const bullet = this.add.rectangle(this.player.getX(), this.player.getY(), 6, 6, 0xffff00);
    this.physics.add.existing(bullet);
    this.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), config.bulletSpeed, bullet.body.velocity);
    bullet.damage = config.damage;
    this.bullets.add(bullet);
  }

  spawnEnemy() {
    if (this.isPaused) return;
    if (this.boss && this.boss.isAlive()) return; // Boss时不生成普通敌人

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

    const rand = Math.random();
    let type = 'normal';
    if (rand < 0.6) type = 'normal';
    else if (rand < 0.85) type = 'fast';
    else if (rand < 0.95) type = 'tank';
    else type = 'shooter';

    const enemy = new Enemy(this, x, y, type);
    this.enemies.add(enemy.sprite);
    enemy.sprite.gameObject = enemy;
  }

  onBulletHitEnemy(bullet, enemySprite) {
    const enemy = enemySprite.gameObject;
    if (!enemy) return;

    bullet.destroy();
    enemy.takeDamage(bullet.damage);
    this.particleManager.createExplosion(enemy.getX(), enemy.getY(), 0xff6600);
    this.soundManager.playHit();

    if (!enemy.isAlive()) {
      enemy.destroy();
      this.score += enemy.config.score * this.level * this.difficultyMultiplier;
      this.playerData.addScore(this.score);
      this.enemiesDefeated++;
      this.totalEnemiesDefeated++;
      this.particleManager.createDamageText(enemy.getX(), enemy.getY(), `+${enemy.config.score * this.level}`);

      // 随机掉落道具
      if (Math.random() < 0.2) {
        this.spawnPowerup(enemy.getX(), enemy.getY());
      }

      if (this.enemiesDefeated >= this.enemiesNeeded) {
        this.nextLevel();
      }
    }
  }

  onPlayerHitEnemy(player, enemySprite) {
    const enemy = enemySprite.gameObject;
    if (!enemy) return;

    this.noDamageThisLevel = false;
    this.player.takeDamage(enemy.config.damage);
    this.soundManager.playExplosion();
    this.particleManager.createDamageText(this.player.getX(), this.player.getY(), `-${enemy.config.damage}`);
  }

  onPlayerHitByBullet(player, bullet) {
    this.noDamageThisLevel = false;
    this.player.takeDamage(5);
    bullet.destroy();
    this.soundManager.playExplosion();
    this.particleManager.createDamageText(this.player.getX(), this.player.getY(), '-5');
  }

  onPlayerCollectPowerup(player, powerupSprite) {
    const powerup = powerupSprite.gameObject;
    if (!powerup) return;

    switch (powerup.type) {
      case 'health':
        this.player.heal(20);
        this.particleManager.createHealText(powerup.getX(), powerup.getY(), 20);
        break;
      case 'weapon_up':
        this.upgradeWeapon();
        break;
      case 'speed':
        this.player.speed += 50;
        break;
      case 'shield':
        this.player.addShield(25);
        break;
    }

    powerup.destroy();
    this.soundManager.playLevelUp();
  }

  spawnPowerup(x, y) {
    const types = ['health', 'weapon_up', 'speed', 'shield'];
    const type = types[Math.floor(Math.random() * types.length)];
    const powerup = new PowerUp(this, x, y, type);
    this.powerups.add(powerup.sprite);
    powerup.sprite.gameObject = powerup;
  }

  upgradeWeapon() {
    const weapons = ['basic', 'spread', 'laser', 'rapid'];
    const currentIndex = weapons.indexOf(this.player.currentWeapon);
    const nextWeapon = weapons[(currentIndex + 1) % weapons.length];
    this.player.weapons[nextWeapon]++;
    this.player.switchWeapon(nextWeapon);
  }

  switchWeapon() {
    const weapons = ['basic', 'spread', 'laser', 'rapid'];
    const currentIndex = weapons.indexOf(this.player.currentWeapon);
    let nextWeapon = weapons[(currentIndex + 1) % weapons.length];
    
    // 找到下一个已解锁的武器
    for (let i = 1; i < weapons.length; i++) {
      const candidate = weapons[(currentIndex + i) % weapons.length];
      if (this.player.weapons[candidate] > 0) {
        nextWeapon = candidate;
        break;
      }
    }
    
    this.player.switchWeapon(nextWeapon);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pauseText.setText('已暂停 - 按P继续');
      this.spawnTimer.paused = true;
    } else {
      this.pauseText.setText('按P暂停 | 按E切换武器');
      this.spawnTimer.paused = false;
    }
  }

  nextLevel() {
    this.level++;
    this.enemiesDefeated = 0;
    this.enemiesNeeded = Math.floor(5 + this.level * 2 * this.difficultyMultiplier);
    this.player.heal(20);

    this.soundManager.playLevelUp();
    this.enemies.clear(true, true);
    this.bullets.clear(true, true);
    this.enemyBullets.clear(true, true);
    this.powerups.clear(true, true);

    // 每5关出现一个Boss
    if (this.level % 5 === 0) {
      this.spawnBoss();
    }

    // 检查成就
    this.achievementManager.checkAchievements({
      score: this.score,
      level: this.level,
      enemiesDefeated: this.totalEnemiesDefeated,
      noDamageLevel: this.noDamageThisLevel,
    });

    this.noDamageThisLevel = true;
  }

  spawnBoss() {
    const { width, height } = this.cameras.main;
    this.boss = new Boss(this, width / 2, height / 3);
    this.enemies.add(this.boss.sprite);
    this.boss.sprite.gameObject = this.boss;
  }

  onBulletHitBoss(bullet, bossSprite) {
    const boss = bossSprite.gameObject;
    if (!boss) return;

    bullet.destroy();
    boss.takeDamage(bullet.damage * 2);
    this.particleManager.createExplosion(boss.getX(), boss.getY(), 0xff00ff);

    if (!boss.isAlive()) {
      boss.destroy();
      this.score += 500 * this.level * this.difficultyMultiplier;
      this.enemiesDefeated++;
      this.totalEnemiesDefeated++;
      this.boss = null;

      // 显示Boss击败消息
      const msg = this.add.text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        '★ Boss被击败! ★',
        {
          fontSize: '48px',
          fill: '#ffff00',
          fontStyle: 'bold',
        }
      ).setOrigin(0.5);

      this.tweens.add({
        targets: msg,
        alpha: 0,
        duration: 2000,
        onComplete: () => msg.destroy(),
      });
    }
  }

  endGame() {
    this.soundManager.playGameOver();
    this.scene.start('GameOverScene', {
      score: this.score,
      level: this.level,
      enemiesDefeated: this.totalEnemiesDefeated,
      highScore: this.playerData.highScore,
    });
  }
}
