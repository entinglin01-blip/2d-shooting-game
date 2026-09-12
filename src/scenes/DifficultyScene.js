import Phaser from 'phaser';
import { CONFIG } from '../config/GameConfig';

export default class DifficultyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DifficultyScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);

    // 标题
    this.add.text(width / 2, 60, '选择难度', {
      fontSize: '48px',
      fill: '#00ff00',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const difficulties = ['EASY', 'NORMAL', 'HARD', 'NIGHTMARE'];
    const startY = 160;
    const spacing = 90;

    difficulties.forEach((difficulty, index) => {
      const y = startY + index * spacing;
      const diffConfig = CONFIG.DIFFICULTIES[difficulty];

      const button = this.add.rectangle(width / 2, y, 300, 70, 0x444444);
      button.setInteractive({ useHandCursor: true });
      button.setStrokeStyle(2, 0xffff00);

      const text = this.add.text(
        width / 2,
        y - 10,
        diffConfig.name,
        {
          fontSize: '28px',
          fill: '#ffff00',
        }
      ).setOrigin(0.5);

      const multiplier = this.add.text(
        width / 2,
        y + 20,
        `倍数: ${diffConfig.multiplier}x`,
        {
          fontSize: '14px',
          fill: '#cccccc',
        }
      ).setOrigin(0.5);

      button.on('pointerdown', () => {
        this.scene.start('GameScene', { difficulty });
      });

      button.on('pointerover', () => {
        button.setFillStyle(0x666666);
      });

      button.on('pointerout', () => {
        button.setFillStyle(0x444444);
      });
    });

    this.add.text(width / 2, height - 50, '← 返回 [按ESC]', {
      fontSize: '16px',
      fill: '#999999',
      align: 'center',
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });
  }
}
