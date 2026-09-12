// Boss敵人
export default class Boss {
  constructor(scene, x, y) {
    this.scene = scene;
    this.health = 50;
    this.maxHealth = 50;
    this.sprite = scene.add.rectangle(x, y, 80, 80, 0xff00ff);
    scene.physics.add.existing(this.sprite);

    this.shootTimer = 0;
    this.patternTimer = 0;
    this.pattern = 0;
  }

  update(player) {
    if (!player) return;

    // Boss不動，只射擊
    this.shootTimer--;
    this.patternTimer--;

    if (this.shootTimer <= 0) {
      this.shootPattern(player);
      this.shootTimer = 30;
    }

    if (this.patternTimer <= 0) {
      this.pattern = (this.pattern + 1) % 3;
      this.patternTimer = 120;
    }
  }

  shootPattern(player) {
    const px = player.getX();
    const py = player.getY();
    const baseAngle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, px, py);

    let angles = [];
    if (this.pattern === 0) {
      // 直線射擊
      angles = [baseAngle];
    } else if (this.pattern === 1) {
      // 三向射擊
      angles = [baseAngle - 0.3, baseAngle, baseAngle + 0.3];
    } else {
      // 五向射擊
      angles = [baseAngle - 0.6, baseAngle - 0.3, baseAngle, baseAngle + 0.3, baseAngle + 0.6];
    }

    angles.forEach((angle) => {
      const bullet = this.scene.add.rectangle(this.sprite.x, this.sprite.y, 8, 8, 0xffaa00);
      this.scene.physics.add.existing(bullet);
      bullet.isEnemyBullet = true;
      this.scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), 250, bullet.body.velocity);
      
      if (!this.scene.enemyBullets) {
        this.scene.enemyBullets = this.scene.physics.add.group();
      }
      this.scene.enemyBullets.add(bullet);
    });
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
