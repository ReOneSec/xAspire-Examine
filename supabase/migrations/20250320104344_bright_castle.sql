/*
  # Add Insert Permissions for Quiz Tables

  1. Changes
    - Add INSERT policies for quiz_sets and questions tables
    - Allow public access for creating quizzes and questions
    
  2. Security
    - Enable public access for quiz creation
    - Maintain existing read policies
*/

-- Add INSERT policy for quiz_sets
CREATE POLICY "Allow public insert access to quiz_sets"
  ON quiz_sets
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Add INSERT policy for questions
CREATE POLICY "Allow public insert access to questions"
  ON questions
  FOR INSERT
  TO public
  WITH CHECK (true);