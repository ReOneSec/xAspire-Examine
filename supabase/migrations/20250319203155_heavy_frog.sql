/*
  # Quiz System Database Schema

  1. New Tables
    - `subjects`
      - `id` (uuid, primary key)
      - `name` (text) - Subject name like NEET, JEE
      - `created_at` (timestamp)
    
    - `quiz_sets`
      - `id` (uuid, primary key)
      - `subject_id` (uuid, foreign key)
      - `name` (text) - Set name like "Biology Set 1"
      - `created_at` (timestamp)
    
    - `questions`
      - `id` (uuid, primary key)
      - `quiz_set_id` (uuid, foreign key)
      - `text` (text)
      - `image_url` (text, optional)
      - `options` (jsonb)
      - `correct_answer` (integer)
      - `explanation` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_sets table
CREATE TABLE IF NOT EXISTS quiz_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_set_id uuid REFERENCES quiz_sets(id) ON DELETE CASCADE,
  text text NOT NULL,
  image_url text,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to subjects"
  ON subjects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to quiz_sets"
  ON quiz_sets
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to questions"
  ON questions
  FOR SELECT
  TO public
  USING (true);

-- Insert initial subjects
INSERT INTO subjects (name) VALUES
  ('NEET'),
  ('JEE'),
  ('JENPAS'),
  ('WBJEE');