import { GrammarQuestion, LogicQuestion, MatchingItem, SentenceData } from './types';

// Stage 1: Material Warehouse (Phrases)
export const MATCHING_PAIRS: { id: number; en: string; cn: string }[] = [
  { id: 1, en: 'cheer up', cn: '振奋 / 让...高兴' },
  { id: 2, en: 'hold the door', cn: '为别人扶门' },
  { id: 3, en: 'get on well with', cn: '与...相处得好' },
  { id: 4, en: 'care for', cn: '关爱 / 照顾' },
  { id: 5, en: 'be ready to help', cn: '乐于助人' },
];

// Stage 2: Foundation (Grammar)
export const GRAMMAR_QUESTIONS: GrammarQuestion[] = [
  {
    id: 1,
    pre: "Sam is kind. He always",
    post: "toys.",
    options: [{ text: "share", correct: false }, { text: "shares", correct: true }],
    hint: "主语是 'He'（第三人称单数），动词要加 s 哦！"
  },
  {
    id: 2,
    pre: "Aiwen is polite. She",
    post: "\"hi\" to others.",
    options: [{ text: "say", correct: false }, { text: "says", correct: true }],
    hint: "主语是 'She'，动词需要加 s。"
  },
  {
    id: 3,
    pre: "Lucas is helpful. He",
    post: "the table.",
    options: [{ text: "clean", correct: false }, { text: "cleans", correct: true }],
    hint: "别忘了 'He' 后面动词要变身（加 s）！"
  },
  {
    id: 4,
    pre: "Alice is a good friend. She",
    post: "me up.",
    options: [{ text: "cheer", correct: false }, { text: "cheers", correct: true }],
    hint: "She... cheers! 记得三单规则。"
  }
];

// Stage 3: Logic Engineer
export const LOGIC_QUESTIONS: LogicQuestion[] = [
  {
    id: 1,
    opinion: "Sam is very kind.",
    options: [
      { id: 'A', text: "He likes ice cream.", isCorrect: false, feedback: "逻辑错误：喜欢冰淇淋并不能说明他很善良！" },
      { id: 'B', text: "He helps people and cares for animals.", isCorrect: true, feedback: "回答正确！乐于助人是善良的表现。" },
      { id: 'C', text: "He help people.", isCorrect: false, feedback: "语法错误：'He' 后面应该是 'helps' (加 s)。" }
    ]
  },
  {
    id: 2,
    opinion: "Aiwen is a good host.",
    options: [
      { id: 'A', text: "She treats guests well.", isCorrect: true, feedback: "回答正确！善待客人才是好主人。" },
      { id: 'B', text: "She plays alone.", isCorrect: false, feedback: "逻辑错误：独自玩耍跟当好主人没关系哦。" },
      { id: 'C', text: "She treat guests well.", isCorrect: false, feedback: "语法错误：'She' 后面应该是 'treats' (加 s)。" }
    ]
  },
  {
    id: 3,
    opinion: "Alice is a good listener.",
    options: [
      { id: 'A', text: "She talks a lot.", isCorrect: false, feedback: "逻辑错误：说得太多反而说明不善倾听！" },
      { id: 'B', text: "She is always ready to listen.", isCorrect: true, feedback: "回答正确！随时准备倾听才是好听众。" },
      { id: 'C', text: "She never listen to others.", isCorrect: false, feedback: "逻辑错误：从不听别人说话怎么是好听众呢？" }
    ]
  }
];

// Stage 4: Skyscraper (Word Order)
export const SENTENCE_CHALLENGE: SentenceData = {
  target: ["She", "always", "helps", "me", "."],
  words: ["helps", ".", "She", "me", "always"]
};
