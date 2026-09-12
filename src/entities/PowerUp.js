// 道具系統
export default class PowerUp {
  constructor(scene, x, y, type = 'health') {
    this.scene = scene;
    this.type = type;

    const colors = {
      health: 0x00ff00,
      weapon_up: 0xffff00,
      speed: 0x00ffff,
      shield: 0xff00ff,
    };

    const icons = {
      health: '❤️',
      weapon_up: '⚡',
      speed: '⚙️',
      shield: '🛡️',
    };

    this.sprite = scene.add.rectangle(x, y, 30, 30, colors[type]);
    scene.physics.add.existing(this.sprite);

    this.text = scene.add.text(x, y, icons[type], {
      fontSize: '20px',
    }).setOrigin(0.5);

    this.lifetime = 10000; // 10秒後消失
    scene.time.delayedCall(this.lifetime, () => {
      this.destroy();
    });
  }

  update() {
    // 輕微旋轉效果
    this.sprite.rotation += 0.02;
    this.text.rotation = this.sprite.rotation;
  }

  getX() {
    return this.sprite.x;
  }

  getY() {
    return this.sprite.y;
  }

  destroy() {
    this.sprite.destroy();
    this.text.destroy();
  }
}
