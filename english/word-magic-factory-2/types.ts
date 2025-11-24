export type RuleStage = {
  id: string;
  type: 'rule';
  title: string;
  content: string;
  examples: { original: string; transformed: string }[];
  highlight?: string;
  buttonText: string;
};

export type QuizStage = {
  id: string;
  type: 'quiz';
  word: string;
  options: string[];
  correctOption: string;
  hint: string;
  ruleRef: string; // References which rule applies (e.g., 's', 'es', 'y', 'have')
};

export type GameStage = RuleStage | QuizStage;

export type GameState = {
  currentStageIndex: number;
  score: number;
  mistakes: string[]; // List of words user got wrong
  completed: boolean;
};
