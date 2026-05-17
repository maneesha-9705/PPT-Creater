import { useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectContext';

/**
 * Auto-saves answers to the backend after 1.5s debounce.
 * @param {string} projectId
 * @param {number} slideIndex
 * @param {Array} answers
 */
const useAutoSave = (projectId, slideIndex, answers) => {
  const { saveAnswers } = useProject();
  const timerRef = useRef(null);
  const prevRef  = useRef(null);

  useEffect(() => {
    if (!projectId || !answers) return;
    const stringified = JSON.stringify(answers);
    if (stringified === prevRef.current) return;
    prevRef.current = stringified;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try { await saveAnswers(projectId, slideIndex, answers); } catch (_) {}
    }, 1500);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [answers, projectId, slideIndex, saveAnswers]);
};

export default useAutoSave;
