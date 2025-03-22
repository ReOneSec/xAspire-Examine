import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { ClipboardList, GraduationCap, ChevronRight, Clock, ListChecks, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Quiz, Subject } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const QuizList = () => {
  const { quizzes, setQuizzes } = useQuizStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if Supabase client is properly initialized
        if (!supabase) {
          throw new Error('Database client not initialized');
        }

        // Fetch subjects with error handling
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .order('name');

        if (subjectsError) {
          throw subjectsError;
        }

        setSubjects(subjectsData || []);

        // Fetch quiz sets with error handling
        const { data: quizSets, error: quizSetsError } = await supabase
          .from('quiz_sets')
          .select(`
            id,
            name,
            subject_id,
            questions (
              id,
              text,
              image_url,
              options,
              correct_answer,
              explanation
            )
          `);

        if (quizSetsError) {
          throw quizSetsError;
        }

        const transformedQuizzes: Quiz[] = (quizSets || []).map(quizSet => ({
          id: quizSet.id,
          name: quizSet.name,
          subjectId: quizSet.subject_id,
          questions: (quizSet.questions || []).map(q => ({
            id: q.id,
            text: q.text,
            imageUrl: q.image_url,
            options: q.options,
            correctAnswer: q.correct_answer,
            explanation: q.explanation
          }))
        }));

        setQuizzes(transformedQuizzes);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quiz data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setQuizzes]);

  if (error) {
    return (
      <motion.div 
        className="min-h-[400px] flex flex-col items-center justify-center text-center p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="button-primary"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div 
          className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!selectedSubject) {
    return (
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Select Your Exam</h2>
            </div>
            <p className="mt-2 text-white/80">Choose from our comprehensive selection of exam papers</p>
          </div>
          
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {subjects.map((subject) => (
                <motion.button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className="group relative flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <ClipboardList className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                      <p className="text-sm text-gray-500">
                        {quizzes.filter(q => q.subjectId === subject.id).length} papers available
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentSubject = subjects.find(s => s.id === selectedSubject);
  const subjectQuizzes = quizzes.filter(quiz => quiz.subjectId === selectedSubject);

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">{currentSubject?.name}</h2>
                <p className="text-white/80">Available question papers</p>
              </div>
            </div>
            <motion.button
              onClick={() => setSelectedSubject(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          {subjectQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No papers available</h3>
                <p className="mt-2 text-gray-500">
                  Check back later for {currentSubject?.name} question papers.
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {subjectQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/quiz/${quiz.id}`}
                      className="group block p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200 hover:shadow-lg"
                    >
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary transition-colors">
                        {quiz.name}
                      </h3>
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <ListChecks className="h-4 w-4" />
                          <span>{quiz.questions.length} questions</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{quiz.questions.length} minutes</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-primary">
                        <span className="text-sm font-medium">Start Quiz</span>
                        <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuizList;

export default QuizList