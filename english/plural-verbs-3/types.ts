export enum GameStage {
  INTRO = 'INTRO',
  TUTORIAL = 'TUTORIAL',
  PRACTICE = 'PRACTICE',
  LOGIC = 'LOGIC',
  RESULT = 'RESULT'
}

export interface PracticeQuestion {
  id: number;
  subject: string;
  sentence_part_1: string;
  sentence_part_2: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface LogicQuestion {
  text: string;
  isCorrect: boolean;
  correction: string;
  explanation: string;
}