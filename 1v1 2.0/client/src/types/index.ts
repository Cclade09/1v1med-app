export interface Question {
  id: string;
  topic: string;
  difficulty: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  correct_answer: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
}

export interface User {
  id: string;
  username: string;
  currentQuestion: number;
  score: number;
  answeredQuestions: number;
  startTime?: number;
}

export interface Room {
  code: string;
  creator: User;
  opponent?: User;
  settings: RoomSettings;
  questions: Question[];
  status: 'waiting' | 'active' | 'completed';
  winner?: string;
}

export interface RoomSettings {
  topics: string[];
  difficulties: number[];
  questionCount: number;
}

export interface GameState {
  room: Room | null;
  currentUser: User | null;
  isCreator: boolean;
}

export const TOPICS = [
  { id: 'behavioural_sciences', name: 'Behavioural Sciences', count: 0 },
  { id: 'biochemistry', name: 'Biochemistry', count: 0 },
  { id: 'embryology', name: 'Embryology', count: 0 },
  { id: 'genetics', name: 'Genetics', count: 0 },
  { id: 'immunology', name: 'Immunology', count: 0 },
  { id: 'microbiology', name: 'Microbiology', count: 0 },
  { id: 'pathology', name: 'Pathology', count: 0 },
  { id: 'pharmacology', name: 'Pharmacology', count: 0 },
  { id: 'statistics', name: 'Statistics', count: 0 },
  { id: 'cardiovascular_system', name: 'Cardiovascular System', count: 0 },
  { id: 'endocrine_system', name: 'Endocrine System', count: 0 },
  { id: 'gastrointestinal_system', name: 'Gastrointestinal System', count: 0 },
  { id: 'haematology_oncology', name: 'Haematology and Oncology', count: 0 },
  { id: 'musculoskeletal_skin', name: 'Musculoskeletal System and Skin', count: 0 },
  { id: 'neurological_system', name: 'Neurological System', count: 0 },
  { id: 'psychiatry', name: 'Psychiatry', count: 0 },
  { id: 'renal_system', name: 'Renal System', count: 0 },
  { id: 'reproductive_system', name: 'Reproductive System', count: 0 },
  { id: 'respiratory_system', name: 'Respiratory System', count: 0 },
];