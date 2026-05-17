const { generateHint, validateSlideContent } = require('../services/groqService');

const getHint = async (req, res) => {
  const { question, slideTitle } = req.body;
  try {
    const hint = await generateHint(question, slideTitle);
    res.json({ hint });
  } catch (error) {
    console.error('Hint generation error:', error);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
};

const validate = async (req, res) => {
  const { slideTitle, enrichedContent } = req.body;
  try {
    const validation = await validateSlideContent(slideTitle, enrichedContent);
    res.json(validation);
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Failed to validate slide' });
  }
};

module.exports = { getHint, validate };