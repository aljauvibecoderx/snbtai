import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Room ID Generator ─────────────────────────────────────────────────────
export const generateRoomId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
};

// ─── Create Room ───────────────────────────────────────────────────────────
export const createRoom = async (hostUser) => {
  const roomId = generateRoomId();
  const roomData = {
    roomId,
    hostId: hostUser.uid,
    hostName: hostUser.displayName || 'Host',
    hostPhoto: hostUser.photoURL || null,
    players: [
      {
        id: hostUser.uid,
        name: hostUser.displayName || 'Host',
        photo: hostUser.photoURL || null,
        isReady: false,
        score: 0,
        answers: {},
        finishedAt: null,
      },
    ],
    status: 'waiting', // waiting | generating | ready | playing | finished
    questions: [],
    currentQuestionIndex: 0,
    startTime: null,
    endTime: null,
    timerDuration: 30, // seconds per question
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'ambis_battle_rooms', roomId), roomData);
  return roomId;
};

// ─── Join Room ─────────────────────────────────────────────────────────────
export const joinRoom = async (roomId, user) => {
  const roomRef = doc(db, 'ambis_battle_rooms', roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) throw new Error('Room tidak ditemukan.');

  const room = roomSnap.data();
  if (room.status !== 'waiting' && room.status !== 'ready')
    throw new Error('Room sudah tidak bisa dimasuki.');
  if (room.players.length >= 2) throw new Error('Room sudah penuh (maks. 2 pemain).');
  if (room.players.find((p) => p.id === user.uid)) return room; // already in room

  const updatedPlayers = [
    ...room.players,
    {
      id: user.uid,
      name: user.displayName || 'Player',
      photo: user.photoURL || null,
      isReady: false,
      score: 0,
      answers: {},
      finishedAt: null,
    },
  ];

  await updateDoc(roomRef, {
    players: updatedPlayers,
    updatedAt: serverTimestamp(),
  });

  return { ...room, players: updatedPlayers };
};

// ─── Toggle Ready ──────────────────────────────────────────────────────────
export const togglePlayerReady = async (roomId, userId) => {
  const roomRef = doc(db, 'ambis_battle_rooms', roomId);
  const roomSnap = await getDoc(roomRef);
  if (!roomSnap.exists()) throw new Error('Room tidak ditemukan.');

  const room = roomSnap.data();
  const updatedPlayers = room.players.map((p) =>
    p.id === userId ? { ...p, isReady: !p.isReady } : p
  );

  await updateDoc(roomRef, { players: updatedPlayers, updatedAt: serverTimestamp() });
};

// ─── Save Questions to Room ────────────────────────────────────────────────
export const saveQuestionsToRoom = async (roomId, questions) => {
  const roomRef = doc(db, 'ambis_battle_rooms', roomId);
  await updateDoc(roomRef, {
    questions,
    status: 'ready',
    updatedAt: serverTimestamp(),
  });
};

// ─── Start Battle ──────────────────────────────────────────────────────────
export const startBattle = async (roomId) => {
  const roomRef = doc(db, 'ambis_battle_rooms', roomId);
  const now = Date.now();
  await updateDoc(roomRef, {
    status: 'playing',
    currentQuestionIndex: 0,
    startTime: now,
    updatedAt: serverTimestamp(),
  });
};

// ─── Submit Answer ─────────────────────────────────────────────────────────
export const submitAnswer = async (roomId, userId, questionIndex, answerIndex, timeTaken) => {
  const roomRef = doc(db, 'ambis_battle_rooms', roomId);
  const roomSnap = await getDoc(roomRef);
  if (!roomSnap.exists()) return;

  const room = roomSnap.data();
  const question = room.questions[questionIndex];
  const isCorrect = question && answerIndex === question.correctIndex;
  const pointsEarned = isCorrect ? Math.max(100 - timeTaken * 2, 20) : 0;

  const updatedPlayers = room.players.map((p) => {
    if (p.id !== userId) return p;
    const newAnswers = { ...p.answers, [questionIndex]: { answerIndex, isCorrect, timeTaken } };
    const newScore = (p.score || 0) + pointsEarned;
    return { ...p, answers: newAnswers, score: newScore };
  });

  await updateDoc(roomRef, { players: updatedPlayers, updatedAt: serverTimestamp() });
};

// ─── Advance Question ──────────────────────────────────────────────────────
export const advanceQuestion = async (roomId, nextIndex, totalQuestions) => {
  const roomRef = doc(db, 'ambis_battle_rooms', roomId);
  if (nextIndex >= totalQuestions) {
    await updateDoc(roomRef, {
      status: 'finished',
      endTime: Date.now(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(roomRef, {
      currentQuestionIndex: nextIndex,
      updatedAt: serverTimestamp(),
    });
  }
};

// ─── Finish Battle (force) ─────────────────────────────────────────────────
export const finishBattle = async (roomId) => {
  const roomRef = doc(db, 'ambis_battle_rooms', roomId);
  await updateDoc(roomRef, {
    status: 'finished',
    endTime: Date.now(),
    updatedAt: serverTimestamp(),
  });
};

// ─── Update Room Status ───────────────────────────────────────────────────
export const updateRoomStatus = async (roomId, status) => {
  const roomRef = doc(db, 'ambis_battle_rooms', roomId);
  await updateDoc(roomRef, { status, updatedAt: serverTimestamp() });
};

// ─── Real-Time Listener ────────────────────────────────────────────────────
export const listenToRoom = (roomId, callback) => {
  const roomRef = doc(db, 'ambis_battle_rooms', roomId);
  return onSnapshot(roomRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() });
    } else {
      callback(null);
    }
  });
};

// ─── Get Room (one-time) ──────────────────────────────────────────────────
export const getRoom = async (roomId) => {
  const roomSnap = await getDoc(doc(db, 'ambis_battle_rooms', roomId));
  if (!roomSnap.exists()) return null;
  return { id: roomSnap.id, ...roomSnap.data() };
};

// ─── Leave Room ───────────────────────────────────────────────────────────
export const leaveRoom = async (roomId, userId) => {
  const roomRef = doc(db, 'ambis_battle_rooms', roomId);
  const roomSnap = await getDoc(roomRef);
  if (!roomSnap.exists()) return;

  const room = roomSnap.data();
  const updatedPlayers = room.players.filter((p) => p.id !== userId);

  if (updatedPlayers.length === 0 || room.hostId === userId) {
    // Delete room if host leaves or room is empty
    await deleteDoc(roomRef);
  } else {
    await updateDoc(roomRef, { players: updatedPlayers, updatedAt: serverTimestamp() });
  }
};
