import { useState, useCallback, useRef, useEffect } from 'react';
import { saveQuestionSet, saveQuestion, saveAttempt, finishAttempt } from '../services/firebase/firebase';
import { IRTScoring } from '../utils/irt-scoring';

/**
 * Custom hook for managing exam state and logic
 * @returns {Object} Exam state and handlers
 */
export const useExamState = () => {
  const [questions, setQuestions] = useState([]);
  const [questionSetId, setQuestionSetId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [raguRagu, setRaguRagu] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [attemptId, setAttemptId] = useState(null);
  const [isExamActive, setIsExamActive] = useState(false);

  const timerRef = useRef(null);

  // Timer management
  useEffect(() => {
    if (isExamActive) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isExamActive]);

  const startExam = useCallback(async () => {
    setIsExamActive(true);
    setTimer(0);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setRaguRagu({});
  }, []);

  const handleAnswer = useCallback((questionIndex, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  }, []);

  const toggleRagu = useCallback((questionIndex) => {
    setRaguRagu(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIdx(prev => Math.min(prev + 1, questions.length - 1));
  }, [questions.length]);

  const previousQuestion = useCallback(() => {
    setCurrentQuestionIdx(prev => Math.max(prev - 1, 0));
  }, []);

  const finishExam = useCallback(async () => {
    setIsExamActive(false);
    
    // Calculate IRT score
    const correctAnswers = Object.entries(userAnswers).filter(
      ([idx, answer]) => questions[idx]?.correctIndex === answer
    ).length;
    
    const irtScore = IRTScoring.calculateScore(
      correctAnswers,
      questions.length,
      3 // Average difficulty
    );

    setScore(irtScore);

    // Save attempt to Firebase
    if (attemptId) {
      await finishAttempt(attemptId, {
        userAnswers,
        raguRagu,
        score: irtScore,
        timeSpent: timer,
        finishedAt: new Date()
      });
    }

    return irtScore;
  }, [userAnswers, raguRagu, questions, timer, attemptId]);

  const resetExam = useCallback(() => {
    setQuestions([]);
    setQuestionSetId(null);
    setUserAnswers({});
    setRaguRagu({});
    setCurrentQuestionIdx(0);
    setTimer(0);
    setScore(0);
    setAttemptId(null);
    setIsExamActive(false);
  }, []);

  return {
    // State
    questions,
    questionSetId,
    userAnswers,
    raguRagu,
    currentQuestionIdx,
    timer,
    score,
    attemptId,
    isExamActive,
    
    // Actions
    setQuestions,
    setQuestionSetId,
    setAttemptId,
    startExam,
    handleAnswer,
    toggleRagu,
    nextQuestion,
    previousQuestion,
    finishExam,
    resetExam
  };
};
