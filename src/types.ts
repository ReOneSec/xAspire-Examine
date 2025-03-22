export interface Question {
  id: string;
  text: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Subject {
  id: string;
  name: string;
  created_at: string;
}

export interface QuizSet {
  id: string;
  subject_id: string;
  name: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  name: string;
  subjectId: string;
  questions: Question[];
}

export interface QuizAttempt {
  quizId: string;
  answers: Record<string, number>;
  startTime: number;
  endTime?: number;
  aspirantName?: string;
  markedQuestions: string[]; // Array of question IDs that are marked for review
}
