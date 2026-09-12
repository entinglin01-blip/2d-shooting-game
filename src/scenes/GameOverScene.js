import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.finalLevel = data.level || 1;
  }

  create() {
    const { width, height } = this.cameras.main;

    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);

    // 遊戲結束文本
    this.add.text(width / 2, height / 3 - 40, '遊戲結束', {
      fontSize: '60px',
      fill: '#ff0000',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 最終分數
    this.add.text(width / 2, height / 2 - 30, `最終分數: ${this.finalScore}`, {
      fontSize: '28px',
      fill: '#ffff00',
    }).setOrigin(0.5);

    // 到達的關卡
    this.add.text(width / 2, height / 2 + 20, `到達關卡: ${this.finalLevel}`, {
      fontSize: '28px',
      fill: '#00ff00',
    }).setOrigin(0.5);

    // 重新開始按鈕
    const restartButton = this.add.text(width / 2, height / 2 + 100, '重新開始 [按 SPACE]', {
      fontSize: '24px',
      fill: '#ffff00',
      backgroundColor: '#444444',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restartButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // 空格鍵重新開始
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('MenuScene');
    });
  }
}
