const Project = require('../models/Project');
const crypto = require('crypto');

// POST /api/projects
const createProject = async (req, res) => {
  const { projectTitle, teamName, collegeName, selectedTheme } = req.body;
  if (!projectTitle) return res.status(400).json({ message: 'Project title is required' });
  const project = await Project.create({
    userId: req.user._id,
    projectTitle, teamName,
    collegeName: collegeName || req.user.collegeName || 'SRKR Engineering College (A)',
    selectedTheme: selectedTheme || 'biz-vision-blue',
    shareToken: crypto.randomBytes(16).toString('hex'),
  });
  res.status(201).json(project);
};

// GET /api/projects
const getProjects = async (req, res) => {
  const projects = await Project.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  res.json(projects);
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

// PATCH /api/projects/:id
const updateProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const { projectTitle, teamName, collegeName, selectedTheme } = req.body;
  if (projectTitle) project.projectTitle = projectTitle;
  if (teamName) project.teamName = teamName;
  if (collegeName) project.collegeName = collegeName;
  if (selectedTheme) project.selectedTheme = selectedTheme;
  await project.save();
  res.json(project);
};

// GET /api/projects/share/:token (public)
const getProjectByShareToken = async (req, res) => {
  const project = await Project.findOne({ shareToken: req.params.token });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

module.exports = { createProject, getProjects, getProject, updateProject, getProjectByShareToken };
