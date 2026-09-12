import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);

    // 標題
    this.add.text(width / 2, height / 3, '2D射擊游戲', {
      fontSize: '60px',
      fill: '#00ff00',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 開始按鈕
    const startButton = this.add.text(width / 2, height / 2 + 60, '開始游戲 [按 SPACE]', {
      fontSize: '24px',
      fill: '#ffff00',
      backgroundColor: '#444444',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // 空格鍵開始
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });

    // 說明文本
    this.add.text(width / 2, height - 80, '方向鍵移動 | 鼠標/WASD射擊', {
      fontSize: '16px',
      fill: '#cccccc',
    }).setOrigin(0.5);
  }
}
