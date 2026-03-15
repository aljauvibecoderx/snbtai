import { useState, useRef, useCallback } from 'react';
import { GEMINI_KEYS, HF_API_KEY } from '../config/config';

/**
 * Custom hook for managing AI question generation
 * Note: The actual generateQuestions function is in App.js, this hook provides the interface
 * @returns {Object} Generation state and handlers
 */
export const useQuestionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cancelGeneration, setCancelGeneration] = useState(false);
  const generationAbortRef = useRef(null);

  const generate = useCallback(async (context, subtestLabel, complexity, apiKey, modelType, signal, specificInstructions) => {
    setIsGenerating(true);
    setCancelGeneration(false);
    
    try {
      // This will be implemented in App.js for now
      // The hook provides the interface but the actual logic remains in App.js
      console.log('Question generation requested:', { context, subtestLabel, complexity });
      return [];
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Generation cancelled');
      } else {
        console.error('Generation error:', error);
      }
      throw error;
    } finally {
      setIsGenerating(false);
      setCancelGeneration(false);
    }
  }, []);

  const cancel = useCallback(() => {
    if (generationAbortRef.current) {
      generationAbortRef.current.abort();
      setCancelGeneration(true);
    }
  }, []);

  return {
    isGenerating,
    cancelGeneration,
    generate,
    cancel,
    generationAbortRef
  };
};
