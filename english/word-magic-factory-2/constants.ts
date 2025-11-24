import { GameStage, QuizStage } from './types';

// 洗牌算法 - Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 获取所有题目并打乱顺序
export function getAllQuizzesShuffled(): QuizStage[] {
  const allQuizzes = STAGES.filter((stage): stage is QuizStage => stage.type === 'quiz');
  return shuffleArray(allQuizzes);
}

export const STAGES: GameStage[] = [
  // --- Phase 1: 第一招和第二招合并 ---
  {
    id: 'rule-1-2',
    type: 'rule',
    title: '魔法秘籍：第一招和第二招',
    content: '大部分动词直接在尾巴加 s！但如果尾巴发音像"嘶嘶"声（o, s, x, ch, sh），为了好读要加 es！',
    highlight: '一般 + s\no, s, x, ch, sh → + es',
    examples: [
      { original: 'clean', transformed: 'cleans' },
      { original: 'wash', transformed: 'washes' },
      { original: 'go', transformed: 'goes' },
    ],
    buttonText: '开始变身！',
  },
  // 合并并打乱顺序的题目
  {
    id: 'quiz-1-2-1',
    type: 'quiz',
    word: 'go',
    options: ['gos', 'goes', 'goies'],
    correctOption: 'goes',
    hint: 'o 结尾要加 es！',
    ruleRef: 'es',
  },
  {
    id: 'quiz-1-2-2',
    type: 'quiz',
    word: 'clean',
    options: ['cleans', 'cleanes', 'cleanies'],
    correctOption: 'cleans',
    hint: '直接加 s 就好啦！',
    ruleRef: 'General',
  },
  {
    id: 'quiz-1-2-3',
    type: 'quiz',
    word: 'watch',
    options: ['watchs', 'watches', 'watchies'],
    correctOption: 'watches',
    hint: 'ch 结尾有嘶嘶声，要加 es！',
    ruleRef: 'es',
  },
  {
    id: 'quiz-1-2-4',
    type: 'quiz',
    word: 'help',
    options: ['helpes', 'helps', 'helpies'],
    correctOption: 'helps',
    hint: '大部分单词直接加 s 哦。',
    ruleRef: 'General',
  },
  {
    id: 'quiz-1-2-5',
    type: 'quiz',
    word: 'pass',
    options: ['passes', 'passs', 'pasies'],
    correctOption: 'passes',
    hint: 'ss 结尾有嘶嘶声，要加 es！',
    ruleRef: 'es',
  },
  {
    id: 'quiz-1-2-6',
    type: 'quiz',
    word: 'say',
    options: ['saies', 'says', 'sayes'],
    correctOption: 'says',
    hint: 'Ay 结尾直接加 s！',
    ruleRef: 'General',
  },
  {
    id: 'quiz-1-2-7',
    type: 'quiz',
    word: 'wash',
    options: ['washs', 'washes', 'washies'],
    correctOption: 'washes',
    hint: 'sh 结尾有嘶嘶声，要加 es！',
    ruleRef: 'es',
  },
  {
    id: 'quiz-1-2-8',
    type: 'quiz',
    word: 'like',
    options: ['likes', 'likees', 'likies'],
    correctOption: 'likes',
    hint: '已有 e 结尾，直接加 s。',
    ruleRef: 'General',
  },
  {
    id: 'quiz-1-2-9',
    type: 'quiz',
    word: 'do',
    options: ['dos', 'does', 'doos'],
    correctOption: 'does',
    hint: 'o 结尾要加 es！',
    ruleRef: 'es',
  },

  // --- Phase 5: Y Rules ---
  {
    id: 'rule-3',
    type: 'rule',
    title: '魔法秘籍：第三招',
    content: 'Y 字母很调皮！辅音+y 变身，元音+y 不变。',
    highlight: '辅音+y → 变y为i加es\n元音(a,e,i,o,u)+y → 直接加s',
    examples: [
      { original: 'fly', transformed: 'flies' },
      { original: 'play', transformed: 'plays' },
    ],
    buttonText: '挑战高难度！',
  },
  {
    id: 'quiz-3-1',
    type: 'quiz',
    word: 'study',
    options: ['studys', 'studies', 'studyes'],
    correctOption: 'studies',
    hint: 'd 是辅音，变 y 为 i 加 es！',
    ruleRef: 'y-change',
  },
  {
    id: 'quiz-3-2',
    type: 'quiz',
    word: 'play',
    options: ['plaies', 'plays', 'playes'],
    correctOption: 'plays',
    hint: 'a 是元音，Y 不变，直接加 s！',
    ruleRef: 'y-keep',
  },
  {
    id: 'quiz-3-3',
    type: 'quiz',
    word: 'carry',
    options: ['carries', 'carrys', 'carryes'],
    correctOption: 'carries',
    hint: 'r 是辅音，变 y 为 i 加 es！',
    ruleRef: 'y-change',
  },
  {
    id: 'quiz-3-4',
    type: 'quiz',
    word: 'fly',
    options: ['flys', 'flies', 'flyes'],
    correctOption: 'flies',
    hint: 'l 是辅音，变 y 为 i 加 es！',
    ruleRef: 'y-change',
  },

  // --- Phase 7: Irregular ---
  {
    id: 'rule-4',
    type: 'rule',
    title: '最终秘籍：大魔王',
    content: '这个词完全不讲道理，它是特殊的！只能死记硬背哦。',
    highlight: 'have → has',
    examples: [
      { original: 'have', transformed: 'has' },
    ],
    buttonText: '挑战大魔王！',
  },
  {
    id: 'quiz-4-1',
    type: 'quiz',
    word: 'have',
    options: ['haves', 'has', 'havies'],
    correctOption: 'has',
    hint: 'Have 是特殊的，变成 Has！',
    ruleRef: 'irregular',
  },
];