import { jsPDF } from 'jspdf';
import { Quiz, QuizAttempt } from '../types';

interface ExtendedQuizAttempt extends QuizAttempt {
  aspirantName?: string;
}

export const generatePDF = (quiz: Quiz, attempt: ExtendedQuizAttempt) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Function to add header to each page
  const addPageDecoration = () => {
    // Header
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('AspireExamine - Your Path to Success', 20, 10);
    doc.text(new Date().toLocaleDateString(), pageWidth - 20, 10, { align: 'right' });
    doc.line(20, 12, pageWidth - 20, 12);
  };

  // Add decoration to first page
  addPageDecoration();
  
  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AspireExamine', pageWidth / 2, 30, { align: 'center' });
  
  // Credits line with proper spacing
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Crafted with love by SAHABAJ', pageWidth / 2, 40, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.text('A product of Epplicon Technologies', pageWidth / 2, 45, { align: 'center' });
  
  // Add aspirant name if provided
  if (attempt.aspirantName) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Name: ${attempt.aspirantName}`, 20, 55);
    doc.setFont('helvetica', 'normal');
  }
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(quiz.name, 20, attempt.aspirantName ? 65 : 60);
  
  // Performance Metrics
  const timeTaken = attempt.endTime ? attempt.endTime - attempt.startTime : 0;
  const minutes = Math.floor(timeTaken / 60000);
  const seconds = Math.floor((timeTaken % 60000) / 1000);
  const formattedTime = `${minutes} minutes ${seconds} seconds`;
  
  const attempted = Object.keys(attempt.answers).length;
  const correct = quiz.questions.reduce((acc, q) => 
    attempt.answers[q.id] === q.correctAnswer ? acc + 1 : acc, 0);
  const wrong = attempted - correct;
  const score = Math.round((correct / quiz.questions.length) * 100);
  
  // Results box
  const resultsBoxY = attempt.aspirantName ? 75 : 70;
  doc.setDrawColor(70, 70, 200);
  doc.setFillColor(240, 240, 255);
  doc.roundedRect(20, resultsBoxY, pageWidth - 40, 40, 3, 3, 'FD');
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('RESULT SUMMARY', pageWidth / 2, resultsBoxY + 10, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Time Taken: ${formattedTime}`, 30, resultsBoxY + 20);
  doc.text(`Score: ${score}%`, pageWidth - 30, resultsBoxY + 20, { align: 'right' });
  doc.text(`Total Questions: ${quiz.questions.length} | Attempted: ${attempted} | Correct: ${correct} | Wrong: ${wrong}`, 30, resultsBoxY + 30);
  
  // Questions
  let yPos = resultsBoxY + 60;
  let pageCount = 1;
  
  quiz.questions.forEach((question, index) => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      pageCount++;
      addPageDecoration();
      yPos = 30;
    }
    
    // Question box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(15, yPos - 5, pageWidth - 30, 10 + (question.imageUrl ? 10 : 0) + (question.options.length * 6) + 20, 2, 2, 'FD');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`Question ${index + 1}:`, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(question.text, 20, yPos + 7);
    yPos += 15;
    
    if (question.imageUrl) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text(`Image URL: ${question.imageUrl}`, 25, yPos);
      yPos += 10;
    }
    
    // Options
    question.options.forEach((option, optIndex) => {
      const letter = String.fromCharCode(65 + optIndex);
      const isSelected = attempt.answers[question.id] === optIndex;
      const isCorrect = question.correctAnswer === optIndex;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', isSelected ? 'bold' : 'normal');
      
      // Option text color based on status
      if (isSelected) {
        doc.setTextColor(isCorrect ? 0 : 255, isCorrect ? 128 : 0, 0);
      } else if (optIndex === question.correctAnswer) {
        doc.setTextColor(0, 128, 0);
      } else {
        doc.setTextColor(0, 0, 0);
      }
      
      const optionText = `${letter}) ${option}`;
      const statusSymbol = isSelected ? (isCorrect ? ' ✓' : ' ✗') : (optIndex === question.correctAnswer ? ' ✓' : '');
      doc.text(`${optionText}${statusSymbol}`, 25, yPos);
      yPos += 6;
    });
    
    // Always show explanation
    doc.setTextColor(70, 70, 200);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    const explanationText = `Explanation: ${question.explanation}`;
    const splitExplanation = doc.splitTextToSize(explanationText, pageWidth - 50);
    doc.text(splitExplanation, 25, yPos);
    yPos += (splitExplanation.length * 5) + 15;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated by AspireExamine on ${new Date().toLocaleString()}`, pageWidth/2, pageHeight - 10, { align: 'center' });
  
  return doc;
};
