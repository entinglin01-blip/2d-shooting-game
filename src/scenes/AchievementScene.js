import Phaser from 'phaser';
import { ACHIEVEMENTS } from '../utils/AchievementManager';
import PlayerData from '../utils/PlayerData';

export default class AchievementScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AchievementScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    const playerData = new PlayerData();
    const achievements = playerData.getAchievements();

    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);

    // 標題
    this.add.text(width / 2, 30, '🏆 成就系統', {
      fontSize: '40px',
      fill: '#ffff00',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const achievementList = Object.values(ACHIEVEMENTS);
    const startY = 80;
    const spacing = 40;

    achievementList.forEach((achievement, index) => {
      const y = startY + index * spacing;
      const isUnlocked = achievements.includes(achievement.id);
      const color = isUnlocked ? '#00ff00' : '#666666';
      const icon = isUnlocked ? '🔓' : '🔒';

      this.add.text(40, y, `${icon} ${achievement.name}`, {
        fontSize: '14px',
        fill: color,
      });

      this.add.text(width - 40, y, achievement.description, {
        fontSize: '12px',
        fill: '#999999',
        align: 'right',
      }).setOrigin(1, 0);
    });

    // 統計信息
    const unlockedCount = achievements.length;
    const totalCount = achievementList.length;
    const statsY = startY + achievementList.length * spacing + 20;

    this.add.text(width / 2, statsY, `已解鎖: ${unlockedCount}/${totalCount}`, {
      fontSize: '16px',
      fill: '#ffff00',
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
