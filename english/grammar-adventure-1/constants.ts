import { ThirdPersonItem, BeVerbQuestion } from './types';

export const LEVEL_2_DATA: ThirdPersonItem[] = [
  { word: 'he', isThirdPerson: true },
  { word: 'it', isThirdPerson: true },
  { word: 'Sam', isThirdPerson: true },
  { word: 'Nikki', isThirdPerson: true },
  { word: 'she', isThirdPerson: true },
  { word: 'Aiwen', isThirdPerson: true },
  { word: 'my father', isThirdPerson: true },
  { word: 'we', isThirdPerson: false },
  { word: 'they', isThirdPerson: false },
  { word: 'I', isThirdPerson: false },
  { word: 'you', isThirdPerson: false },
  { word: 'dumplings', isThirdPerson: false, isTrap: true },
  { word: 'noodles', isThirdPerson: false, isTrap: true },
];

export const LEVEL_3_DATA: BeVerbQuestion[] = [
  { sentence: 'I ___ a student.', answer: 'am' },
  { sentence: 'You ___ my best friend.', answer: 'are' },
  { sentence: 'Sam ___ ready to help.', answer: 'is' },
  { sentence: 'He ___ a teacher.', answer: 'is' },
  { sentence: 'Aiwen ___ a good host.', answer: 'is' },
  { sentence: 'We ___ happy.', answer: 'are' },
  { sentence: 'The dumplings ___ yummy.', answer: 'are' },
  { sentence: 'It ___ a cute dog.', answer: 'is' },
  { sentence: 'My father ___ at work.', answer: 'is' },
  { sentence: 'They ___ classmates.', answer: 'are' },
];
