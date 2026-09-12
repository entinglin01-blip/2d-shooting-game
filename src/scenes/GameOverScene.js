import Phaser from 'phaser';
import PlayerData from '../utils/PlayerData';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.finalLevel = data.level || 1;
    this.enemiesDefeated = data.enemiesDefeated || 0;
    this.highScore = data.highScore || 0;
  }

  create() {
    const { width, height } = this.cameras.main;
    const playerData = new PlayerData();

    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);

    // 遊戲結束文本
    this.add.text(width / 2, 60, '遊戲結束', {
      fontSize: '60px',
      fill: '#ff0000',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 統計信息框
    const statsX = width / 2;
    const statsStartY = 150;
    const statsSpacing = 40;

    this.add.rectangle(statsX, statsStartY + statsSpacing * 1.5, 350, statsSpacing * 4 + 20, 0x222222);
    this.add.rectangle(statsX, statsStartY + statsSpacing * 1.5, 350, statsSpacing * 4 + 20, 0x333333).setStrokeStyle(2, 0xffff00);

    // 最終分數
    this.add.text(statsX, statsStartY, '最終分數', {
      fontSize: '18px',
      fill: '#ffff00',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(statsX, statsStartY + statsSpacing, this.finalScore.toString(), {
      fontSize: '32px',
      fill: '#00ff00',
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    // 到達的關卡
    this.add.text(statsX, statsStartY + statsSpacing * 2, `到達關卡: ${this.finalLevel}`, {
      fontSize: '18px',
      fill: '#00ffff',
      align: 'center',
    }).setOrigin(0.5);

    // 擊敗的敵人
    this.add.text(statsX, statsStartY + statsSpacing * 3, `擊敗敵人: ${this.enemiesDefeated}`, {
      fontSize: '18px',
      fill: '#ffaa00',
      align: 'center',
    }).setOrigin(0.5);

    // 歷史最高分
    if (this.highScore > 0) {
      this.add.text(statsX, statsStartY + statsSpacing * 4, `歷史最高: ${this.highScore}`, {
        fontSize: '16px',
        fill: '#ff00ff',
        align: 'center',
      }).setOrigin(0.5);
    }

    // 重新開始按鈕
    const restartButton = this.add.rectangle(width / 2, height / 2 + 80, 280, 60, 0x444444);
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.setStrokeStyle(2, 0xffff00);

    this.add.text(width / 2, height / 2 + 80, '重新開始 [SPACE]', {
      fontSize: '24px',
      fill: '#ffff00',
    }).setOrigin(0.5);

    restartButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    restartButton.on('pointerover', () => {
      restartButton.setFillStyle(0x666666);
    });

    restartButton.on('pointerout', () => {
      restartButton.setFillStyle(0x444444);
    });

    // 返回菜單按鈕
    const menuButton = this.add.rectangle(width / 2, height / 2 + 160, 280, 60, 0x444444);
    menuButton.setInteractive({ useHandCursor: true });
    menuButton.setStrokeStyle(2, 0x00ffff);

    this.add.text(width / 2, height / 2 + 160, '返回菜單 [ESC]', {
      fontSize: '24px',
      fill: '#00ffff',
    }).setOrigin(0.5);

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    menuButton.on('pointerover', () => {
      menuButton.setFillStyle(0x666666);
    });

    menuButton.on('pointerout', () => {
      menuButton.setFillStyle(0x444444);
    });

    // 提示
    this.add.text(width / 2, height - 30, '按SPACE重新開始 | 按ESC返回菜單', {
      fontSize: '14px',
      fill: '#999999',
      align: 'center',
    }).setOrigin(0.5);

    // 鍵盤快捷鍵
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('MenuScene');
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });
  }
}
