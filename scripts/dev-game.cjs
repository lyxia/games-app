#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// 游戏列表（与 gameScanner.ts 保持同步）
const games = [
  { name: '英语语法闯关大冒险', path: 'english/grammar-adventure-1', devPort: 3001 },
  { name: '单词魔法工厂', path: 'english/word-magic-factory-2', devPort: 3002 },
  { name: '语法小侦探：第三课时', path: 'english/plural-verbs-3', devPort: 3003 },
  { name: '逻辑与写作构建者', path: 'english/logic-&-writing-builder-4', devPort: 3004 },
  { name: '平行与垂直特训营', path: 'math/parallel-lines-1', devPort: 3005 },
  { name: '垂线与距离：几何探险工厂', path: 'math/parallel-lines-2', devPort: 3006 },
];

// 过滤出有 package.json 的游戏（可构建的游戏）
const buildableGames = games.filter(game => {
  const packagePath = path.join(__dirname, '..', game.path, 'package.json');
  return fs.existsSync(packagePath);
});

console.log('\n🎮 选择要开发的游戏：\n');
buildableGames.forEach((game, i) => {
  console.log(`  ${i + 1}. ${game.name} (端口: ${game.devPort})`);
});
console.log('');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('请输入游戏编号: ', (answer) => {
  const index = parseInt(answer) - 1;
  const game = buildableGames[index];

  if (!game) {
    console.log('\n❌ 无效选择\n');
    rl.close();
    process.exit(1);
  }

  const gamePath = path.join(__dirname, '..', game.path);

  console.log(`\n🚀 启动 ${game.name} 开发服务器...`);
  console.log(`📍 地址: http://localhost:${game.devPort}\n`);

  // 检查是否安装了依赖
  const nodeModulesPath = path.join(gamePath, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 正在安装依赖...\n');
    const installProcess = spawn('npm', ['install'], {
      cwd: gamePath,
      stdio: 'inherit',
      shell: true
    });

    installProcess.on('close', (code) => {
      if (code !== 0) {
        console.log('\n❌ 依赖安装失败\n');
        rl.close();
        process.exit(code);
      }
      startDevServer(gamePath, game);
    });
  } else {
    startDevServer(gamePath, game);
  }

  rl.close();
});

function startDevServer(gamePath, game) {
  const devProcess = spawn('npm', ['run', 'dev'], {
    cwd: gamePath,
    stdio: 'inherit',
    shell: true
  });

  devProcess.on('close', (code) => {
    process.exit(code);
  });
}
