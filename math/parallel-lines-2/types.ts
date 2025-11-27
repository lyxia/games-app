
export interface Concept {
  id: number;
  title: string;
  content: string;
  icon: string;
}

export interface Quiz {
  id: number;
  question: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
}

export interface Scenario {
  id: number;
  title: string;
  desc: string;
  svgMode: "pipeline" | "duck" | "paper";
  options: ScenarioOption[];
}

export enum AppView {
  LAB = 'LAB',
  SCENARIOS = 'SCENARIOS',
  QUIZ = 'QUIZ'
}

export enum LabTab {
  SHORTEST_PATH = 'SHORTEST_PATH',
  PARALLEL_TRACKS = 'PARALLEL_TRACKS',
  DRAWING_ANIMATION = 'DRAWING_ANIMATION',
  RECTANGLE_BUILDER = 'RECTANGLE_BUILDER',
  PARALLEL_LINE_DRAWING = 'PARALLEL_LINE_DRAWING',
  SQUARE_BUILDER = 'SQUARE_BUILDER'
}
