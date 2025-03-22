import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';
import { Plus, X, Loader2, BookOpen, Image, CheckCircle, AlertCircle, Trash2, MoveUp, MoveDown, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const AdminPanel = () => {
  const { addQuiz, loadSubjects, subjects } = useQuizStore();
  const [quizName, setQuizName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [questions, setQuestions] = useState([{
    id: crypto.randomUUID(),
    text: '',
    imageUrl: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  }]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const resetForm = () => {
    setQuizName('');
    setSelectedSubject('');
    setQuestions([{
      id: crypto.randomUUID(),
      text: '',
      imageUrl: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await addQuiz({
        id: crypto.randomUUID(),
        name: quizName,
        subjectId: selectedSubject,
        questions
      });
      setSuccess(true);
      setTimeout(resetForm, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      id: crypto.randomUUID(),
      text: '',
      imageUrl: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]);
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index];
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: crypto.randomUUID()
    };
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, duplicatedQuestion);
    setQuestions(newQuestions);
  };

  const moveQuestion = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= questions.length) return;
    
    const newQuestions = [...questions];
    const [movedQuestion] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(newQuestions);
  };

  if (!subjects.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <BookOpen className="h-8 w-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Create New Question Paper</h2>
          </div>
        </div>
        
        <div className="p-6">
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-destructive">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div 
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-600">Question paper created successfully!</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Exam Type</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="input-primary"
                  required
                >
                  <option value="">Select an exam</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Paper Name</label>
                <input
                  type="text"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  placeholder="e.g., Paper 1, Biology Set A"
                  className="input-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {questions.map((question, qIndex) => (
                  <motion.div
                    key={question.id}
                    className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute right-4 top-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {qIndex > 0 && (
                        <motion.button
                          type="button"
                          onClick={() => moveQuestion(qIndex, 'up')}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <MoveUp className="h-4 w-4" />
                        </motion.button>
                      )}
                      {qIndex < questions.length - 1 && (
                        <motion.button
                          type="button"
                          onClick={() => moveQuestion(qIndex, 'down')}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <MoveDown className="h-4 w-4" />
                        </motion.button>
                      )}
                      <motion.button
                        type="button"
                        onClick={() => duplicateQuestion(qIndex)}
                        className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Copy className="h-4 w-4" />
                      </motion.button>
                      {questions.length > 1 && (
                        <motion.button
                          type="button"
                          onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))}
                          className="p-1.5 text-gray-500 hover:text-destructive hover:bg-gray-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                        {qIndex + 1}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Question {qIndex + 1}</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Question Text</label>
                        <textarea
                          value={question.text}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[qIndex].text = e.target.value;
                            setQuestions(newQuestions);
                          }}
                          className="input-primary min-h-[80px]"
                          placeholder="Enter your question here..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
                        <div className="relative">
                          <Image className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="url"
                            value={question.imageUrl}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[qIndex].imageUrl = e.target.value;
                              setQuestions(newQuestions);
                            }}
                            className="input-primary pl-10"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        {question.imageUrl && (
                          <img
                            src={question.imageUrl}
                            alt="Question preview"
                            className="mt-2 max-h-40 rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Options</label>
                        <div className="space-y-3">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-3">
                              <div className="relative flex items-center">
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={question.correctAnswer === oIndex}
                                  onChange={() => {
                                    const newQuestions = [...questions];
                                    newQuestions[qIndex].correctAnswer = oIndex;
                                    setQuestions(newQuestions);
                                  }}
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                  required
                                />
                                <span className="absolute -right-6 font-medium text-gray-600">
                                  {String.fromCharCode(65 + oIndex)}
                                </span>
                              </div>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newQuestions = [...questions];
                                  newQuestions[qIndex].options[oIndex] = e.target.value;
                                  setQuestions(newQuestions);
                                }}
                                className="input-primary flex-1"
                                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                required
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Explanation</label>
                        <textarea
                          value={question.explanation}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[qIndex].explanation = e.target.value;
                            setQuestions(newQuestions);
                          }}
                          rows={3}
                          className="input-primary min-h-[80px]"
                          placeholder="Explain why this answer is correct..."
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center pt-6">
              <motion.button
                type="button"
                onClick={addQuestion}
                className="button-secondary flex items-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Plus className="h-5 w-5" />
                Add Question
              </motion.button>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={clsx(
                  "button-primary flex items-center gap-2",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Paper...
                  </>
                ) : (
                  'Create Paper'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;