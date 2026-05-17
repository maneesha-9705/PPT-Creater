import { useState } from 'react';
import api from '../utils/api';

const useAI = () => {
  const [hintLoading, setHintLoading] = useState(false);
  const [hints, setHints] = useState({});

  const getHint = async (questionId, question, slideTitle) => {
    setHintLoading(true);
    try {
      const { data } = await api.post('/ai/hint', { question, slideTitle });
      setHints(prev => ({ ...prev, [questionId]: data.hint }));
      return data.hint;
    } catch (err) {
      console.error('Hint error:', err);
      throw err;
    } finally {
      setHintLoading(false);
    }
  };

  return { getHint, hints, hintLoading };
};

export default useAI;
