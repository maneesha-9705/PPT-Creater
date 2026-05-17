const Project = require('../models/Project');
const { enrichSlideContent, validateSlideContent } = require('../services/groqService');

// POST /api/projects/:id/slides/:slideIndex/answers
const saveAnswers = async (req, res) => {
  const { id, slideIndex } = req.params;
  const { answers } = req.body;
  const idx = parseInt(slideIndex);
  const project = await Project.findOne({ _id: id, userId: req.user._id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  project.slides[idx].answers = answers;
  project.slides[idx].questionsAnswered = true;
  await project.save();
  res.json(project.slides[idx]);
};

// POST /api/projects/:id/slides/:slideIndex/generate
const generateSlide = async (req, res) => {
  const { id, slideIndex } = req.params;
  const idx = parseInt(slideIndex);
  const project = await Project.findOne({ _id: id, userId: req.user._id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const slide = project.slides[idx];
  try {
    const enriched = await enrichSlideContent(idx, slide.slideTitle, slide.answers);
    const validation = await validateSlideContent(slide.slideTitle, enriched);
    slide.aiGeneratedContent = JSON.stringify(enriched);
    slide.qualityScore = validation.score || 7;
    slide.qualitySuggestions = validation.suggestions || [];
    if (idx + 1 > project.currentSlide) project.currentSlide = Math.min(idx + 1, 11);
    if (project.slides.every(s => s.questionsAnswered)) project.isCompleted = true;
    await project.save();
    res.json({ slide: project.slides[idx], enriched, score: validation.score, suggestions: validation.suggestions });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ message: 'AI generation failed', error: err.message });
  }
};

// GET /api/projects/:id/slides/:slideIndex
const getSlide = async (req, res) => {
  const { id, slideIndex } = req.params;
  const project = await Project.findOne({ _id: id, userId: req.user._id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project.slides[parseInt(slideIndex)]);
};

// PATCH /api/projects/:id/slides/:slideIndex/image
const updateSlideImage = async (req, res) => {
  const { id, slideIndex } = req.params;
  const { imageUrl } = req.body;
  const idx = parseInt(slideIndex);
  
  const project = await Project.findOne({ _id: id, userId: req.user._id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  
  project.slides[idx].previewImageUrl = imageUrl;
  await project.save();
  
  res.json({ message: 'Slide image updated successfully', slide: project.slides[idx] });
};

module.exports = { saveAnswers, generateSlide, getSlide, updateSlideImage };
