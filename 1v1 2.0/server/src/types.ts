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
}

export interface Room {
  code: string;
  creator: User;
  opponent?: User;
  settings: RoomSettings;
  questions: Question[];
  status: 'waiting' | 'active' | 'completed';
  winner?: string;
  players: User[];
  completedPlayers: string[];
}

export interface RoomSettings {
  topics: string[];
  difficulties: number[];
  questionCount: number;
}