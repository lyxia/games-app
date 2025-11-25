import { Concept, Quiz, Scenario } from './types';

export const conceptList: Concept[] = [
  { id: 1, title: "点到直线的距离", content: "从直线外一点到这条直线所画的垂直线段最短。这条垂直线段的长度，叫做这点到直线的距离。", icon: "📏" },
  { id: 2, title: "平行线间的距离", content: "两条平行线之间，所有垂直线段的长度都相等。这个长度叫做这两条平行线间的距离。", icon: "🛤️" },
  { id: 3, title: "画垂线四步法", content: "一合（贴紧直线）、二移（找点）、三画（画线）、四标（标直角符号）。", icon: "📐" },
  { id: 4, title: "几何图形的应用", content: "长方形、正方形的邻边互相垂直。平行线间的垂直线段决定了最大正方形的边长。", icon: "⬜" }
];

export const quizList: Quiz[] = [
  { id: 1, question: "小明说：从直线外一点向直线画线段，斜着的线段可能比垂直线段短。", isCorrect: false, explanation: "错误！垂线段是最短的，这是几何铁律。" },
  { id: 2, question: "两条平行线之间，无论在哪里画垂直线段，它们的长度都一样。", isCorrect: true, explanation: "正确！平行线间的距离处处相等。" },
  { id: 3, question: "画长方形时，必须保证相邻的两条边互相垂直。", isCorrect: true, explanation: "正确！这是长方形的基本特征。" }
];

export const scenarioList: Scenario[] = [
  {
    id: 1,
    title: "幸福花园管道设计",
    desc: "村庄在 A 点，主干道是下方的直线。为了节省安装费用（管子越短越省钱），请帮工程师选择正确的施工路线。",
    svgMode: "pipeline",
    options: [
      { id: 'A', text: "斜着修（看起来很酷）", correct: false, feedback: "哎呀，斜着的路线更长，会浪费材料和钱哦！" },
      { id: 'B', text: "垂直修（垂线段最短）", correct: true, feedback: "天才设计师！根据‘垂线段最短’原理，这样最省钱！" }
    ]
  },
  {
    id: 2,
    title: "小鸭子极速渡河",
    desc: "小鸭子在岸边 A 点，对岸是平行的直线。水流很急，它想用最短的路线游到对岸，该怎么游？",
    svgMode: "duck",
    options: [
      { id: 'A', text: "对着对岸垂直游", correct: true, feedback: "正确！点到直线的距离中，垂直路线最短。" },
      { id: 'B', text: "向下游斜着游", correct: false, feedback: "虽然顺水可能快，但路程变长了，不是最短路线哦。" }
    ]
  },
  {
    id: 3,
    title: "裁剪最大正方形",
    desc: "有一张两条边平行的纸带，宽度是 5 厘米。你想剪下一个最大的正方形，这个正方形的边长是多少？",
    svgMode: "paper",
    options: [
      { id: 'A', text: "5 厘米", correct: true, feedback: "正解！正方形的边长受限于平行线间的垂直距离。" },
      { id: 'B', text: "8 厘米", correct: false, feedback: "做不到哦，纸带宽度不够 8 厘米。" }
    ]
  }
];