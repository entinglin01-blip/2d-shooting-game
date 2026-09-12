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
    this.add.text(width / 2, height / 4, '2D射擊遊戲', {
      fontSize: '60px',
      fill: '#00ff00',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 版本信息
    this.add.text(width / 2, height / 4 + 50, 'v1.0.0 完整版', {
      fontSize: '16px',
      fill: '#999999',
      align: 'center',
    }).setOrigin(0.5);

    // 開始遊戲按鈕
    const startButton = this.add.rectangle(width / 2, height / 2 - 40, 280, 60, 0x444444);
    startButton.setInteractive({ useHandCursor: true });
    startButton.setStrokeStyle(2, 0xffff00);

    this.add.text(width / 2, height / 2 - 40, '開始遊戲 [SPACE]', {
      fontSize: '24px',
      fill: '#ffff00',
    }).setOrigin(0.5);

    startButton.on('pointerdown', () => {
      this.scene.start('DifficultyScene');
    });

    startButton.on('pointerover', () => {
      startButton.setFillStyle(0x666666);
    });

    startButton.on('pointerout', () => {
      startButton.setFillStyle(0x444444);
    });

    // 成就按鈕
    const achievementButton = this.add.rectangle(width / 2, height / 2 + 50, 280, 60, 0x444444);
    achievementButton.setInteractive({ useHandCursor: true });
    achievementButton.setStrokeStyle(2, 0x00ffff);

    this.add.text(width / 2, height / 2 + 50, '查看成就 [A]', {
      fontSize: '24px',
      fill: '#00ffff',
    }).setOrigin(0.5);

    achievementButton.on('pointerdown', () => {
      this.scene.start('AchievementScene');
    });

    achievementButton.on('pointerover', () => {
      achievementButton.setFillStyle(0x666666);
    });

    achievementButton.on('pointerout', () => {
      achievementButton.setFillStyle(0x444444);
    });

    // 設置按鈕
    const settingsButton = this.add.rectangle(width / 2, height / 2 + 140, 280, 60, 0x444444);
    settingsButton.setInteractive({ useHandCursor: true });
    settingsButton.setStrokeStyle(2, 0xff00ff);

    this.add.text(width / 2, height / 2 + 140, '設置 [S]', {
      fontSize: '24px',
      fill: '#ff00ff',
    }).setOrigin(0.5);

    settingsButton.on('pointerdown', () => {
      this.scene.start('SettingsScene');
    });

    settingsButton.on('pointerover', () => {
      settingsButton.setFillStyle(0x666666);
    });

    settingsButton.on('pointerout', () => {
      settingsButton.setFillStyle(0x444444);
    });

    // 說明文本
    this.add.text(width / 2, height - 80, '方向鍵/WASD移動 | 鼠標/空格射擊 | E切換武器 | P暫停', {
      fontSize: '14px',
      fill: '#cccccc',
      align: 'center',
    }).setOrigin(0.5);

    // 鍵盤快捷鍵
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('DifficultyScene');
    });

    this.input.keyboard.on('keydown-A', () => {
      this.scene.start('AchievementScene');
    });

    this.input.keyboard.on('keydown-S', () => {
      this.scene.start('SettingsScene');
    });
  }
}
