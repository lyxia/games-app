import { PracticeQuestion, LogicQuestion } from './types';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 1,
    subject: "We",
    sentence_part_1: "",
    sentence_part_2: "always  together.",
    options: ["play", "plays"],
    correctAnswer: "play",
    explanation: "侦探笔记：We 是“我们”（复数），不是三单哦！所以动词用原形。"
  },
  {
    id: 2,
    subject: "She",
    sentence_part_1: "",
    sentence_part_2: " tea.",
    options: ["like", "likes"],
    correctAnswer: "likes",
    explanation: "侦探笔记：She 是“她”，典型的三单（单人），动词要加 s！"
  },
  {
    id: 3,
    subject: "Ben and Sam",
    sentence_part_1: "",
    sentence_part_2: " sports.",
    options: ["do", "does"],
    correctAnswer: "do",
    explanation: "陷阱警报！Ben 和 Sam 是两个人，所以是复数，不是三单！动词用原形 do。"
  },
  {
    id: 4,
    subject: "Coco",
    sentence_part_1: "",
    sentence_part_2: "always  me.",
    options: ["ask", "asks"],
    correctAnswer: "asks",
    explanation: "侦探笔记：Coco 是一个人名（单数），所以是三单，动词要变身！"
  },
  {
    id: 5,
    subject: "My father",
    sentence_part_1: "",
    sentence_part_2: " to work.",
    options: ["go", "goes"],
    correctAnswer: "goes",
    explanation: "侦探笔记：My father（爸爸）是一个人，属于三单。Go 要变成 Goes！"
  },
  {
    id: 6,
    subject: "I",
    sentence_part_1: "",
    sentence_part_2: " the table.",
    options: ["clean", "cleans"],
    correctAnswer: "clean",
    explanation: "特别注意：I 是“我”，虽然是一个人，但它不是三单！动词用原形。"
  }
];

export const LOGIC_CHALLENGE: LogicQuestion = {
  text: "Sam help me.",
  isCorrect: false,
  correction: "helps",
  explanation: "Sam 是单个人名（三单），动词 help 必须变成 helps 才可以哦！"
};