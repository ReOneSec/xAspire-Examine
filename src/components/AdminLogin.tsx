import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { Lock, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { checkAdminPassword, setAdmin } = useQuizStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminPassword(password)) {
      setAdmin(true);
      navigate('/admin');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <motion.div 
      className="min-h-[80vh] flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-md">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <motion.div
              className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Lock className="h-8 w-8 text-primary" />
            </motion.div>
            <h2 className="mt-4 text-2xl font-bold text-center text-white">Admin Access</h2>
            <p className="mt-2 text-center text-white/80">Enter your password to continue</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="input-primary pl-10"
                    placeholder="Enter admin password"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.p 
                  className="text-destructive text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                className="button-primary w-full py-3"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Login to Admin Panel
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;