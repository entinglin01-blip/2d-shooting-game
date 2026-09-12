// 粒子系統管理器
export default class ParticleManager {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
  }

  createExplosion(x, y, color = 0xff6600) {
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = {
        x: Math.cos(angle) * 200,
        y: Math.sin(angle) * 200,
      };

      this.createParticle(x, y, color, velocity);
    }
  }

  createParticle(x, y, color = 0xff6600, velocity = { x: 0, y: 0 }) {
    const particle = this.scene.add.rectangle(x, y, 8, 8, color);
    this.scene.physics.add.existing(particle);
    particle.body.setVelocity(velocity.x, velocity.y);

    const tween = this.scene.tweens.add({
      targets: particle,
      alpha: 0,
      scale: 0,
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        particle.destroy();
      },
    });

    this.particles.push(particle);
  }

  createDamageText(x, y, damage) {
    const text = this.scene.add.text(x, y, damage.toString(), {
      fontSize: '20px',
      fill: '#ff0000',
      fontStyle: 'bold',
    });

    this.scene.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        text.destroy();
      },
    });
  }

  createHealText(x, y, amount) {
    const text = this.scene.add.text(x, y, `+${amount}`, {
      fontSize: '20px',
      fill: '#00ff00',
      fontStyle: 'bold',
    });

    this.scene.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        text.destroy();
      },
    });
  }
}
