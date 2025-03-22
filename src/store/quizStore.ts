import { create } from 'zustand';
import { Question, Quiz, QuizAttempt, Subject, QuizSet } from '../types';
import { supabase } from '../lib/supabase';

interface QuizStore {
  quizzes: Quiz[];
  currentAttempt: QuizAttempt | null;
  isAdmin: boolean;
  subjects: Subject[];
  quizSets: QuizSet[];
  setQuizzes: (quizzes: Quiz[]) => void;
  addQuiz: (quiz: Quiz) => Promise<void>;
  loadSubjects: () => Promise<void>;
  loadQuizSets: (subjectId: string) => Promise<void>;
  startQuiz: (quizId: string) => void;
  submitAnswer: (questionId: string, answer: number) => void;
  endQuiz: (endTime?: number) => void;
  checkAdminPassword: (password: string) => boolean;
  setAdmin: (status: boolean) => void;
  toggleMarkQuestion: (questionId: string) => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  quizzes: [],
  currentAttempt: null,
  isAdmin: false,
  subjects: [],
  quizSets: [],

  setQuizzes: (quizzes) => set({ quizzes }),

  setAdmin: (status) => set({ isAdmin: status }),

  loadSubjects: async () => {
    const { data: subjects, error } = await supabase
      .from('subjects')
      .select('*');
    
    if (error) {
      console.error('Error loading subjects:', error);
      throw new Error('Failed to load subjects');
    }

    set({ subjects: subjects || [] });
  },

  loadQuizSets: async (subjectId: string) => {
    const { data: quizSets, error } = await supabase
      .from('quiz_sets')
      .select('*')
      .eq('subject_id', subjectId);
    
    if (error) {
      console.error('Error loading quiz sets:', error);
      throw new Error('Failed to load quiz sets');
    }

    set({ quizSets: quizSets || [] });
  },

  addQuiz: async (quiz) => {
    try {
      const { data: quizSet, error: quizSetError } = await supabase
        .from('quiz_sets')
        .insert([{
          name: quiz.name,
          subject_id: quiz.subjectId
        }])
        .select()
        .single();

      if (quizSetError) {
        console.error('Error creating quiz set:', quizSetError);
        throw new Error('Failed to create quiz set');
      }

      if (!quizSet) {
        throw new Error('Quiz set was not created');
      }

      const questionsToInsert = quiz.questions.map(q => ({
        quiz_set_id: quizSet.id,
        text: q.text,
        image_url: q.imageUrl,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) {
        console.error('Error creating questions:', questionsError);
        throw new Error('Failed to create questions');
      }

      set((state) => ({
        quizzes: [...state.quizzes, { ...quiz, id: quizSet.id }]
      }));

      console.log('Quiz created successfully!');
    } catch (error) {
      console.error('Error in addQuiz:', error);
      throw error;
    }
  },

  startQuiz: (quizId) => {
    set({
      currentAttempt: {
        quizId,
        answers: {},
        startTime: Date.now(),
        markedQuestions: [] // Initialize empty array for marked questions
      }
    });
  },

  submitAnswer: (questionId, answer) => {
    set((state) => ({
      currentAttempt: state.currentAttempt ? {
        ...state.currentAttempt,
        answers: {
          ...state.currentAttempt.answers,
          [questionId]: answer
        }
      } : null
    }));
  },

  toggleMarkQuestion: (questionId) => {
    set((state) => {
      if (!state.currentAttempt) return state;

      const markedQuestions = [...(state.currentAttempt.markedQuestions || [])];
      const index = markedQuestions.indexOf(questionId);

      if (index === -1) {
        markedQuestions.push(questionId);
      } else {
        markedQuestions.splice(index, 1);
      }

      return {
        currentAttempt: {
          ...state.currentAttempt,
          markedQuestions
        }
      };
    });
  },

  endQuiz: (endTime = Date.now()) => {
    set((state) => ({
      currentAttempt: state.currentAttempt ? {
        ...state.currentAttempt,
        endTime
      } : null
    }));
  },

  checkAdminPassword: (password) => password === "143QUIZ"
}));
