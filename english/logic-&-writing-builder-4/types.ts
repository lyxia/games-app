export enum GameStage {
  WAREHOUSE = 0,
  FOUNDATION = 1,
  LOGIC = 2,
  SKYSCRAPER = 3,
  COMPLETION = 4
}

export interface MatchingItem {
  id: number;
  text: string;
  type: 'en' | 'cn';
  pairId: number;
}

export interface GrammarQuestion {
  id: number;
  pre: string;
  post: string;
  options: { text: string; correct: boolean }[];
  hint: string;
}

export interface LogicOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string; // e.g., "Logic Error" or "Grammar Error"
}

export interface LogicQuestion {
  id: number;
  opinion: string;
  options: LogicOption[];
}

export interface SentenceData {
  target: string[]; // Correct order
  words: string[]; // Scrambled
}
