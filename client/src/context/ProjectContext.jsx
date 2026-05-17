import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProject = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (payload) => {
    const { data } = await api.post('/projects', payload);
    setProject(data);
    return data;
  }, []);

  const updateProject = useCallback(async (id, payload) => {
    const { data } = await api.patch(`/projects/${id}`, payload);
    setProject(data);
    return data;
  }, []);

  const saveAnswers = useCallback(async (projectId, slideIndex, answers) => {
    const { data } = await api.post(`/projects/${projectId}/slides/${slideIndex}/answers`, { answers });
    setProject(prev => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      slides[slideIndex] = data;
      return { ...prev, slides };
    });
    return data;
  }, []);

  const generateSlide = useCallback(async (projectId, slideIndex) => {
    const { data } = await api.post(`/projects/${projectId}/slides/${slideIndex}/generate`);
    setProject(prev => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      slides[slideIndex] = data.slide;
      return { ...prev, slides, currentSlide: data.slide ? Math.max(prev.currentSlide, slideIndex + 1) : prev.currentSlide };
    });
    return data;
  }, []);

  const generateDeck = useCallback(async (projectId) => {
    const { data } = await api.post(`/projects/${projectId}/generate-deck`);
    setProject(prev => prev ? { ...prev, pptxUrl: data.pptxUrl } : prev);
    return data;
  }, []);

  return (
    <ProjectContext.Provider value={{
      project, projects, loading,
      fetchProjects, fetchProject, createProject, updateProject,
      saveAnswers, generateSlide, generateDeck,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
};
