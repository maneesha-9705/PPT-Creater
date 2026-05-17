const Project = require('../models/Project');
const { generatePPTX } = require('../services/pptxService');
const path = require('path');
const fs = require('fs');

// POST /api/projects/:id/generate-deck
const generateDeck = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  try {
    const buffer = await generatePPTX(project);
    const fileName = `${project.projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}_PitchDeck.pptx`;
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);
    project.pptxUrl = `/uploads/${fileName}`;
    await project.save();
    res.json({ pptxUrl: project.pptxUrl, message: 'Deck generated successfully!' });
  } catch (err) {
    console.error('PPTX error:', err);
    res.status(500).json({ message: 'PPTX generation failed', error: err.message });
  }
};

// GET /api/projects/:id/download-deck
const downloadDeck = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
  if (!project || !project.pptxUrl) return res.status(404).json({ message: 'Deck not generated yet' });
  const filePath = path.join(__dirname, '..', project.pptxUrl);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on server' });
  res.download(filePath);
};

module.exports = { generateDeck, downloadDeck };
