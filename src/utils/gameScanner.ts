export interface GameInfo {
  category: string; // 学科分类，如 'english', 'math', 'science', 'chinese' 等
  name: string;
  description: string;
  path: string;
  folderName: string;
  type: 'component' | 'html'; // 游戏类型：React 组件或 HTML 内容
  dataPath?: string; // HTML 类型游戏的数据路径（JSON 文件）
}

// 游戏列表（手动维护，因为需要读取文件系统在浏览器中不可用）
export const games: GameInfo[] = [
  {
    category: 'english',
    name: '英语语法闯关大冒险',
    description: '专为四年级学生设计的互动英语语法游戏，学习 Be 动词和第三人称单数规则。',
    path: 'english/grammar-adventure-1',
    folderName: 'grammar-adventure-1',
    type: 'component'
  },
  {
    category: 'english',
    name: '单词魔法工厂',
    description: '专为四年级学生设计的魔法英语语法游戏，掌握第三人称单数动词规则。',
    path: 'english/word-magic-factory-2',
    folderName: 'word-magic-factory-2',
    type: 'component'
  },
  {
    category: 'english',
    name: '语法小侦探：第三课时',
    description: '针对小学四年级的英语语法闯关游戏：主语 -> 三单 -> 动词变形',
    path: 'english/plural-verbs-3',
    folderName: 'plural-verbs-3',
    type: 'component'
  },
  {
    category: 'english',
    name: '逻辑与写作构建者',
    description: '英语语法闯关第四课时：以建筑为主题的游戏，掌握短语、第三人称单数动词和写作中的逻辑推理。',
    path: 'english/logic-&-writing-builder-4',
    folderName: 'logic-&-writing-builder-4',
    type: 'component'
  },
  {
    category: 'math',
    name: '平行与垂直特训营',
    description: '小学数学专项训练游戏，通过概念记忆卡、陷阱大扫除、图形辨析和奥数计算等模块，全面掌握平行与垂直的知识点。',
    path: 'math/parallel-lines-1',
    folderName: 'parallel-lines-1',
    type: 'component'
  },
  {
    category: 'science',
    name: '第4课：我们是怎样听到声音的',
    description: '交互式耳朵解剖图、声音传播模拟、听觉结构与作用配对游戏',
    path: 'science/ear',
    folderName: 'ear',
    type: 'html',
    dataPath: '/science/ear/ear.json'
  }
];

export function getGamesByCategory(category: string): GameInfo[] {
  return games.filter(game => game.category === category);
}

export function getGameByPath(category: string, gameName: string): GameInfo | undefined {
  return games.find(game => game.category === category && game.folderName === gameName);
}

