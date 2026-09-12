import Phaser from 'phaser';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SettingsScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);

    // 標題
    this.add.text(width / 2, 40, '⚙️ 設置', {
      fontSize: '48px',
      fill: '#00ff00',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const startY = 140;
    const spacing = 80;

    // 音量控制
    this.add.text(60, startY, '音效音量:', {
      fontSize: '20px',
      fill: '#ffff00',
    });

    const volumeBar = this.add.rectangle(260, startY + 10, 300, 20, 0x333333);
    volumeBar.setStrokeStyle(2, 0xffff00);

    const volumeFill = this.add.rectangle(210, startY + 10, 100, 20, 0x00ff00);

    this.add.text(580, startY, '50%', {
      fontSize: '14px',
      fill: '#cccccc',
    });

    // 亮度控制
    this.add.text(60, startY + spacing, '亮度:', {
      fontSize: '20px',
      fill: '#ffff00',
    });

    const brightnessBar = this.add.rectangle(260, startY + spacing + 10, 300, 20, 0x333333);
    brightnessBar.setStrokeStyle(2, 0xffff00);

    const brightnessFill = this.add.rectangle(260, startY + spacing + 10, 300, 20, 0xffffff);
    brightnessFill.setAlpha(0.5);

    this.add.text(580, startY + spacing, '100%', {
      fontSize: '14px',
      fill: '#cccccc',
    });

    // 難度說明
    this.add.text(width / 2, startY + spacing * 2 - 20, '難度說明', {
      fontSize: '18px',
      fill: '#00ffff',
    }).setOrigin(0.5);

    const difficultyInfo = `
    簡單: 敵人速度減慢30%，傷害減少30%
    普通: 原始難度設置
    困難: 敵人速度提升50%，傷害提升50%
    夢魘: 敵人速度和傷害翻倍
    `;

    this.add.text(width / 2, startY + spacing * 2 + 50, difficultyInfo, {
      fontSize: '12px',
      fill: '#999999',
      align: 'center',
    }).setOrigin(0.5);

    // 返回按鈕
    this.add.text(width / 2, height - 30, '← 返回菜單 [ESC]', {
      fontSize: '16px',
      fill: '#999999',
      align: 'center',
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });
  }
}
