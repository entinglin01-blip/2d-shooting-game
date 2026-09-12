import { CONFIG, WEAPON_CONFIG } from '../config/GameConfig';

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.add.rectangle(x, y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE, 0x00ff00);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(true);

    this.health = CONFIG.PLAYER_MAX_HEALTH;
    this.maxHealth = CONFIG.PLAYER_MAX_HEALTH;
    this.shield = 0;
    this.maxShield = 50;
    this.currentWeapon = 'basic';
    this.weapons = { basic: 1, spread: 0, laser: 0, rapid: 0 };
    this.speed = CONFIG.PLAYER_SPEED;
    this.lastShootTime = 0;
  }

  update(keys, pointer) {
    this.handleMovement(keys);
  }

  handleMovement(keys) {
    let vx = 0;
    let vy = 0;

    if (keys.up.isDown || keys.w.isDown) vy -= this.speed;
    if (keys.down.isDown || keys.s.isDown) vy += this.speed;
    if (keys.left.isDown || keys.a.isDown) vx -= this.speed;
    if (keys.right.isDown || keys.d.isDown) vx += this.speed;

    this.sprite.body.setVelocity(vx, vy);
  }

  takeDamage(amount) {
    if (this.shield > 0) {
      const shieldDamage = Math.min(this.shield, amount);
      this.shield -= shieldDamage;
      amount -= shieldDamage;
    }

    if (amount > 0) {
      this.health -= amount;
      this.health = Math.max(0, this.health);
    }
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  addShield(amount) {
    this.shield = Math.min(this.maxShield, this.shield + amount);
  }

  switchWeapon(weaponType) {
    if (this.weapons[weaponType] > 0) {
      this.currentWeapon = weaponType;
      return true;
    }
    return false;
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
