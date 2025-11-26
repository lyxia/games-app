#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const gamesDirs = ['english', 'math'];
const rootDir = path.join(__dirname, '..');

console.log('\n🎮 开始构建所有游戏...\n');

let builtCount = 0;
let failedCount = 0;

gamesDirs.forEach(dir => {
  const dirPath = path.join(rootDir, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  目录不存在: ${dir}/`);
    return;
  }

  const gameFolders = fs.readdirSync(dirPath);

  gameFolders.forEach(gameFolder => {
    const gamePath = path.join(dirPath, gameFolder);
    const packageJsonPath = path.join(gamePath, 'package.json');

    // 只处理有 package.json 的目录
    if (!fs.existsSync(packageJsonPath)) {
      return;
    }

    console.log(`📦 构建 ${dir}/${gameFolder}...`);

    try {
      // 安装依赖
      execSync('npm ci || npm install', {
        cwd: gamePath,
        stdio: 'inherit',
        shell: true
      });

      // 构建
      execSync('npm run build', {
        cwd: gamePath,
        stdio: 'inherit',
        shell: true
      });

      console.log(`✅ ${dir}/${gameFolder} 构建成功\n`);
      builtCount++;
    } catch (error) {
      console.error(`❌ ${dir}/${gameFolder} 构建失败\n`);
      failedCount++;
    }
  });
});

console.log('\n' + '='.repeat(50));
console.log(`🎉 构建完成！成功: ${builtCount}, 失败: ${failedCount}`);
console.log('='.repeat(50) + '\n');

if (failedCount > 0) {
  process.exit(1);
}
