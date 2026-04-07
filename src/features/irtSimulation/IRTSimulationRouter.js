/**
 * IRTSimulationRouter.js
 *
 * Routing entry-point for the IRT Simulation feature.
 * Handles URL-based session identification with the pattern:
 *   /irt-simulation/{namaSection}/{kodeSesiSingkat}
 *   /irt-simulation/snbt-simulation/{kodeSesiSingkat}
 *
 * This component is lazy-loaded by App.js when the path matches /irt-simulation/*.
 * It does NOT touch any other feature — all logic remains inside IRTSimulationPage.
 *
 * Session state bridge (exam results):
 *   The SNBT Exam sub-route stores its result in sessionStorage under key
 *   'irt_exam_result_{sessionCode}' so IRTSimulationPage can pick it up after
 *   the router redirects back to /irt-simulation/hasil-analisis/{code}.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IRTSimulationPage from '../../pages/IRTSimulationPage';
import SNBTExamPage from '../../pages/SNBTExamPage';
import {
  parseIRTPath,
  buildIRTPath,
  buildSNBTExamPath,
  generateSessionCode,
} from './irtSessionUtils';

// ── Storage key helpers ───────────────────────────────────────────────────────

const examResultKey = (code) => `irt_exam_result_${code}`;
const configKey = (code) => `irt_session_config_${code}`;

/**
 * IRTSimulationRouter
 *
 * Props forwarded from App.js:
 *   user, onLogin, onLogout, setView
 */
const IRTSimulationRouter = ({ user, onLogin, onLogout, setView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionCodeRef = useRef(null);
  const parsed = parseIRTPath(location.pathname);

  // Initialise a session code on first mount if URL has none
  useEffect(() => {
    if (!parsed) {
      navigate('/irt-simulation/konfigurasi/' + generateSessionCode(), { replace: true });
      return;
    }

    if (!parsed.sessionCode) {
      const code = generateSessionCode();
      sessionCodeRef.current = code;
      navigate(buildIRTPath(parsed.section || 1, null, null, code), { replace: true });
    } else {
      sessionCodeRef.current = parsed.sessionCode;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Persist session config to sessionStorage ─────────────────────────────

  const persistConfig = useCallback((ptnId, scaleId) => {
    const code = sessionCodeRef.current;
    if (!code) return;
    try {
      sessionStorage.setItem(configKey(code), JSON.stringify({ ptnId, scaleId }));
    } catch (_) { }
  }, []);

  // ── Navigate helper used by child pages ─────────────────────────────────

  /** Called by IRTSimulationPage when the internal step changes */
  const handleStepChange = useCallback(
    (step, ptnId, scaleId) => {
      const code = sessionCodeRef.current || generateSessionCode(ptnId, scaleId);
      sessionCodeRef.current = code;
      persistConfig(ptnId, scaleId);
      navigate(buildIRTPath(step, ptnId, scaleId, code), { replace: true });
    },
    [navigate, persistConfig]
  );

  /** Called by IRTSimulationPage when the user chooses "Kerjakan Ujian SNBT" */
  const handleStartExam = useCallback(() => {
    const code = sessionCodeRef.current || generateSessionCode();
    navigate(buildSNBTExamPath(code), { replace: true });
  }, [navigate]);

  /** Called by SNBTExamPage when the exam is done */
  const handleExamComplete = useCallback(
    (examData) => {
      const code = sessionCodeRef.current || generateSessionCode();
      // Persist exam result so IRTSimulationPage can pick it up after redirect
      try {
        sessionStorage.setItem(examResultKey(code), JSON.stringify(examData));
      } catch (_) { }
      // Navigate back to the hasil-analisis (step 4) section
      navigate(buildIRTPath(4, null, null, code), { replace: true });
    },
    [navigate]
  );

  /** Called on full reset — clears session storage and starts fresh */
  const handleReset = useCallback(() => {
    const oldCode = sessionCodeRef.current;
    if (oldCode) {
      try {
        sessionStorage.removeItem(examResultKey(oldCode));
        sessionStorage.removeItem(configKey(oldCode));
      } catch (_) { }
    }
    const code = generateSessionCode();
    sessionCodeRef.current = code;
    navigate(buildIRTPath(1, null, null, code), { replace: true });
  }, [navigate]);

  // ── Render ───────────────────────────────────────────────────────────────

  if (!parsed) return null;

  const currentCode = parsed.sessionCode || sessionCodeRef.current;

  // SNBT Exam sub-route
  if (parsed.isSNBTExam) {
    return (
      <SNBTExamPage
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        navigate={navigate}
        setView={setView}
        onExamComplete={handleExamComplete}
        sessionCode={currentCode}
      />
    );
  }

  // IRT Simulation wizard
  // If landing on step 4 (hasil-analisis), check sessionStorage for pending exam result
  const pendingExamResult = (() => {
    if (parsed.section !== 4 || !currentCode) return null;
    try {
      const raw = sessionStorage.getItem(examResultKey(currentCode));
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  })();

  return (
    <IRTSimulationPage
      user={user}
      onLogin={onLogin}
      onLogout={onLogout}
      navigate={navigate}
      setView={setView}
      // Extra props injected by router:
      initialStep={parsed.section || 1}
      sessionCode={currentCode}
      pendingExamResult={pendingExamResult}
      onStepChange={handleStepChange}
      onStartExam={handleStartExam}
      onRouterReset={handleReset}
    />
  );
};

export default IRTSimulationRouter;
