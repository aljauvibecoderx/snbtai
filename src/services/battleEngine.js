import { useEffect, useState, useRef, useCallback } from 'react';
import { listenToRoom, submitAnswer, advanceQuestion } from './firebase/ambisBattle';

export const QUESTION_DURATION = 30; // 30 seconds per question

/**
 * useBattleEngine - Centralized battle logic hook
 * Manages server-synchronized timers, auto-submissions, and safe transitions.
 * 
 * Key design: Advancement is triggered DIRECTLY from answer submit and timer
 * expiry — NOT from a useEffect watching reactive state (which causes stale-state
 * race conditions and the "stuck on synchronizing" bug).
 */
export const useBattleEngine = (roomId, user) => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [phase, setPhase] = useState('countdown'); // countdown | playing | transitioning
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION);
  const [showExplanation, setShowExplanation] = useState(false);

  // Refs for synchronous state tracking — avoids stale-closure race conditions
  const hasAdvancedRef = useRef(false); // Prevents double-advance per question
  const currentIndexRef = useRef(0);
  const isHostRef = useRef(false);
  const opponentRef = useRef(null);
  const questionsLengthRef = useRef(0);
  const timerRef = useRef(null);
  const unsubRef = useRef(null);

  // Derived state (rendered from room snapshot)
  const isHost = room?.hostId === user?.uid;
  const myPlayer = room?.players?.find(p => p.id === user?.uid);
  const opponent = room?.players?.find(p => p.id !== user?.uid);
  const questions = room?.questions || [];
  const currentIndex = room?.currentQuestionIndex || 0;
  const currentQuestion = questions[currentIndex];

  const hasMyAnswer = myPlayer?.answers?.[currentIndex] !== undefined;
  const hasOpponentAnswer = opponent?.answers?.[currentIndex] !== undefined;

  const currentStartTime = room?.questionStartsAt;

  // Keep refs in sync with latest derived values for use inside callbacks/intervals
  useEffect(() => {
    isHostRef.current = isHost;
    opponentRef.current = opponent;
    questionsLengthRef.current = questions.length;
  });

  // ─── Centralized Advance Function ───────────────────────────────────────────
  // Called directly from answer submit & timer expiry — NOT from a useEffect.
  const triggerAdvance = useCallback((questionIndex) => {
    if (hasAdvancedRef.current) return; // Already advanced this question
    hasAdvancedRef.current = true;

    setTimeout(() => {
      // Host (or solo player) always pushes the advance to Firebase
      if (isHostRef.current || !opponentRef.current) {
        advanceQuestion(roomId, questionIndex + 1, questionsLengthRef.current)
          .catch(e => console.error('[BattleEngine] Advance error:', e));
      }
      // Non-host fallback: if host appears dead 3s after scheduled advance, client forces it
      else {
        setTimeout(() => {
          advanceQuestion(roomId, questionIndex + 1, questionsLengthRef.current)
            .catch(e => console.error('[BattleEngine] Client fallback advance:', e));
        }, 3000);
      }
    }, 2500); // 2.5s result-viewing buffer
  }, [roomId]);

  // ─── 1. Room Listener Sync ───────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId || !user) return;

    unsubRef.current = listenToRoom(roomId, (data) => {
      if (!data) {
        setError('Room tidak ditemukan.');
        return;
      }

      // Reset the advance guard when a new question index appears
      if (data.currentQuestionIndex !== currentIndexRef.current) {
        hasAdvancedRef.current = false;
        currentIndexRef.current = data.currentQuestionIndex || 0;
        setShowExplanation(false);
      }

      setRoom(data);
      setLoading(false);
    });

    return () => {
      if (unsubRef.current) unsubRef.current();
      clearInterval(timerRef.current);
    };
  }, [roomId, user]);

  // ─── 2. Server-Synchronized Timer ───────────────────────────────────────────
  useEffect(() => {
    if (!room || !currentStartTime || room.status === 'finished') return;

    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const msSinceStart = now - currentStartTime;

      // A. Countdown phase (question hasn't started yet)
      if (msSinceStart < 0) {
        setPhase('countdown');
        setCountdown(Math.ceil(Math.abs(msSinceStart) / 1000));
        return;
      }

      // B. Playing phase
      const timeRemaining = Math.max(0, QUESTION_DURATION - Math.floor(msSinceStart / 1000));
      setPhase('playing');
      setTimeLeft(timeRemaining);

      // C. Time is up — auto-submit null + advance
      if (timeRemaining <= 0) {
        clearInterval(timerRef.current);

        const qIdx = currentIndexRef.current;
        const myAnswers = room.players?.find(p => p.id === user?.uid)?.answers;

        if (myAnswers?.[qIdx] === undefined) {
          // Auto-submit empty answer
          submitAnswer(roomId, user.uid, qIdx, -1, QUESTION_DURATION)
            .then(() => triggerAdvance(qIdx))   // ← advance AFTER submit resolves
            .catch(console.error);
        } else {
          // Already answered — just advance (host only)
          triggerAdvance(qIdx);
        }
      }
    }, 250);

    return () => clearInterval(timerRef.current);
  }, [room?.status, currentStartTime, roomId, user, triggerAdvance]);

  // ─── 3. Answer Submission ────────────────────────────────────────────────────
  const handleAnswerSubmit = useCallback(async (optionIndex) => {
    if (phase !== 'playing' || hasMyAnswer) return;

    const qIdx = currentIndexRef.current;
    const timeTaken = Math.max(1, QUESTION_DURATION - timeLeft);

    try {
      await submitAnswer(roomId, user.uid, qIdx, optionIndex, timeTaken);
      triggerAdvance(qIdx); // ← advance DIRECTLY after submit, no useEffect middleman
    } catch (e) {
      console.error('[BattleEngine] Submit failed, retrying...', e);
      setTimeout(async () => {
        try {
          await submitAnswer(roomId, user.uid, qIdx, optionIndex, timeTaken);
          triggerAdvance(qIdx);
        } catch (e2) {
          console.error('[BattleEngine] Retry also failed:', e2);
        }
      }, 1500);
    }
  }, [phase, hasMyAnswer, roomId, user, timeLeft, triggerAdvance]);

  return {
    room,
    loading,
    error,
    phase,
    countdown,
    timeLeft,
    showExplanation,
    setShowExplanation,
    isHost,
    myPlayer,
    opponent,
    questions,
    currentIndex,
    currentQuestion,
    hasMyAnswer,
    hasOpponentAnswer,
    handleAnswerSubmit,
  };
};
