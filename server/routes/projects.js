const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createProject, getProjects, getProject, updateProject, getProjectByShareToken } = require('../controllers/projectController');
const { generateDeck, downloadDeck } = require('../controllers/deckController');
const { saveAnswers, generateSlide, getSlide, updateSlideImage } = require('../controllers/slideController');

router.get('/share/:token', getProjectByShareToken);
router.use(protect);
router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.patch('/:id', updateProject);
router.post('/:id/generate-deck', generateDeck);
router.get('/:id/download-deck', downloadDeck);
router.post('/:id/slides/:slideIndex/answers', saveAnswers);
router.post('/:id/slides/:slideIndex/generate', generateSlide);
router.patch('/:id/slides/:slideIndex/image', updateSlideImage);
router.get('/:id/slides/:slideIndex', getSlide);

module.exports = router;
