import { ENEMY_CONFIG } from '../config/GameConfig';

export default class Enemy {
  constructor(scene, x, y, type = 'normal') {
    this.scene = scene;
    this.type = type;
    this.config = ENEMY_CONFIG[type];
    this.health = this.config.health;

    const colors = {
      normal: 0xff0000,
      fast: 0xffff00,
      tank: 0xff8800,
      shooter: 0xff00ff,
    };

    this.sprite = scene.add.rectangle(x, y, this.config.size, this.config.size, colors[type]);
    scene.physics.add.existing(this.sprite);

    this.targetX = null;
    this.targetY = null;
    this.shootTimer = 0;
  }

  update(player) {
    if (!player) return;

    const px = player.getX();
    const py = player.getY();

    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, px, py);
    this.scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), this.config.speed, this.sprite.body.velocity);

    // 射手敵人會發射子彈
    if (this.type === 'shooter') {
      this.shootTimer--;
      if (this.shootTimer <= 0) {
        this.shoot(px, py);
        this.shootTimer = 60; // 1秒後再射
      }
    }
  }

  shoot(px, py) {
    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, px, py);
    const bullet = this.scene.add.rectangle(this.sprite.x, this.sprite.y, 6, 6, 0xffaa00);
    this.scene.physics.add.existing(bullet);
    bullet.isEnemyBullet = true;
    this.scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), 200, bullet.body.velocity);
    
    if (!this.scene.enemyBullets) {
      this.scene.enemyBullets = this.scene.physics.add.group();
    }
    this.scene.enemyBullets.add(bullet);
  }

  takeDamage(amount) {
    this.health -= amount;
  }

  isAlive() {
    return this.health > 0;
  }

  getX() {
    return this.sprite.x;
  }

  getY() {
    return this.sprite.y;
  }

  destroy() {
    this.sprite.destroy();
  }
}
