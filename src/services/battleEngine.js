import { useEffect, useState, useRef, useCallback } from 'react';
import { listenToRoom, submitAnswer, advanceQuestion, finishBattle } from './firebase/ambisBattle';

export const QUESTION_DURATION = 60; // 60 seconds per question (as requested)

/**
 * useBattleEngine - Centralized battle logic hook
 * Manages server-synchronized timers, auto-submissions, and safe transitions
 */
export const useBattleEngine = (roomId, user) => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [phase, setPhase] = useState('countdown'); // countdown | playing | transitioning
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const timerRef = useRef(null);
  const unsubRef = useRef(null);

  // Derived state
  const isHost = room?.hostId === user?.uid;
  const myPlayer = room?.players?.find(p => p.id === user?.uid);
  const opponent = room?.players?.find(p => p.id !== user?.uid);
  const questions = room?.questions || [];
  const currentIndex = room?.currentQuestionIndex || 0;
  const currentQuestion = questions[currentIndex];
  
  const hasMyAnswer = myPlayer?.answers?.[currentIndex] !== undefined;
  const hasOpponentAnswer = opponent?.answers?.[currentIndex] !== undefined;
  const allPlayersAnswered = hasMyAnswer && (!opponent || hasOpponentAnswer); // Single or Dual
  
  const currentStartTime = room?.questionStartsAt;

  // 1. Room Listener Sync
  useEffect(() => {
    if (!roomId || !user) return;

    unsubRef.current = listenToRoom(roomId, (data) => {
      if (!data) {
        setError('Room not found');
        return;
      }
      setRoom(data);
      setLoading(false);
      
      // Auto-finish transition handled by firebase listener natively
    });

    return () => {
      if (unsubRef.current) unsubRef.current();
      clearInterval(timerRef.current);
    };
  }, [roomId, user]);

  // 2. Server-Synchronized Clock Control
  useEffect(() => {
    if (!room || !currentStartTime || room.status === 'finished') return;
    
    clearInterval(timerRef.current);
    
    // Safety Fallback loop
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const stTime = currentStartTime;
      const msSinceStart = now - stTime;
      
      // A. Countdown Phase (before question starts)
      if (msSinceStart < 0) {
        setPhase('countdown');
        setShowExplanation(false);
        setCountdown(Math.ceil(Math.abs(msSinceStart) / 1000));
        return;
      }

      // B. Playing Phase
      setPhase('playing');
      const timeRemaining = Math.max(0, QUESTION_DURATION - Math.floor(msSinceStart / 1000));
      setTimeLeft(timeRemaining);

      // C. Time Expiration Force Action
      if (timeRemaining <= 0) {
        clearInterval(timerRef.current);
        
        // AUTO SUBMIT: If user hasn't answered, submit an empty answer (-1) explicitly
        if (myPlayer && myPlayer.answers?.[currentIndex] === undefined) {
          console.log("[BattleEngine] Time is up. Auto-submitting null.");
          submitAnswer(roomId, user.uid, currentIndex, -1, QUESTION_DURATION).catch(console.error);
        }
      }
    }, 250);

    return () => clearInterval(timerRef.current);
  }, [room?.status, currentStartTime, myPlayer, currentIndex, roomId, user]);

  // 3. Centralized Advancement Logic (No longer stuck on waiting!)
  useEffect(() => {
    // If we're fully synced, check if it's time to forcefully advance to next node
    // Condition to advance: Both players answered OR Timer is solidly expired + everyone got mapped answers.
    if (!room || phase !== 'playing' || room.status === 'finished') return;

    if (allPlayersAnswered || timeLeft <= 0) {
      setPhase('transitioning');
      
      // Display explanations optionally right before advancing 
      
      // We rely on ANY host/client to push the advance if it's lagging. The Server/Firebase transactional safety prevents duplicate advances!
      // But typically, only the Host pushes it to avoid spam, UNLESS the host is dead. Let's make the engine completely independent.
      // Small buffer to allow players to read the "Wrong/Right" result before switching
      const advanceTimer = setTimeout(() => {
        if (isHost || !opponent) {
           advanceQuestion(roomId, currentIndex + 1, questions.length).catch(e => console.error("Advance error", e));
        } else if (!isHost && timeLeft <= -5) {
           // Fallback mechanism: if Client sees host is dead for 5 seconds after timeout, client forces advance.
           advanceQuestion(roomId, currentIndex + 1, questions.length).catch(e => console.error("Client forced advance", e));
        }
      }, 4000); // Wait 4 seconds for result viewing before triggering standard next

      return () => clearTimeout(advanceTimer);
    }
  }, [allPlayersAnswered, timeLeft, phase, room, roomId, currentIndex, questions.length, isHost, opponent]);

  // 4. Exposed Actions
  const handleAnswerSubmit = useCallback(async (optionIndex) => {
    if (phase !== 'playing' || hasMyAnswer) return;
    
    const timeTaken = Math.max(0, QUESTION_DURATION - timeLeft);
    
    try {
      await submitAnswer(roomId, user.uid, currentIndex, optionIndex, timeTaken);
    } catch (e) {
      console.error("[BattleEngine] Failed to submit answer. Retrying...", e);
      // Basic retry mechanism fallback
      setTimeout(() => submitAnswer(roomId, user.uid, currentIndex, optionIndex, timeTaken), 1000);
    }
  }, [phase, hasMyAnswer, roomId, user, currentIndex, timeLeft]);

  return {
    room,
    loading,
    error,
    phase,
    countdown,
    timeLeft,
    showExplanation,
    setShowExplanation, // Toggles "View Explanation" rendering
    isHost,
    myPlayer,
    opponent,
    questions,
    currentIndex,
    currentQuestion,
    hasMyAnswer,
    hasOpponentAnswer,
    allPlayersAnswered,
    handleAnswerSubmit
  };
};
