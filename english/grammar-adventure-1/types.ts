
export enum Level {
  LESSON_THIRD_PERSON = 1,
  GAME_EAGLE_EYE = 2,
  LESSON_BE_VERB = 3,
  GAME_BE_VERB = 4,
  VICTORY = 5,
}

export interface ThirdPersonItem {
  word: string;
  isThirdPerson: boolean;
  isTrap?: boolean; // For dumplings/noodles
}

export interface BeVerbQuestion {
  sentence: string;
  answer: 'am' | 'is' | 'are';
}
