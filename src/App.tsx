import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import QuizList from './components/QuizList';
import QuizAttempt from './components/QuizAttempt';
import { useQuizStore } from './store/quizStore';
import clsx from 'clsx';

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isAdmin = useQuizStore(state => state.isAdmin);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link to="/" className="flex items-center group">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Brain className="h-8 w-8 text-primary group-hover:text-primary/90 transition-colors" />
                  </motion.div>
                  <span className="ml-2 text-xl font-bold gradient-text">AspireExamine</span>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:space-x-4">
                <Link to="/" className="nav-link">
                  Home
                </Link>
                <Link
                  to="/admin"
                  className="button-primary"
                >
                  Admin Panel
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                className="md:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                    to="/"
                    className={clsx(
                      "block px-3 py-2 rounded-md text-base font-medium",
                      "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/admin"
                    className="button-primary w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<QuizList />} />
              <Route 
                path="/admin" 
                element={
                  isAdmin ? <AdminPanel /> : <Navigate to="/admin/login" replace />
                } 
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/quiz/:id" element={<QuizAttempt />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              Crafted with ❤️ by <a href="t.me/ViperROX" className="text-primary hover:text-primary/90 transition-colors">SAHABAJ</a>
            </p>
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} AspireExamine. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;