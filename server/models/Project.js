const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: String },
  question: { type: String },
  answer: { type: String, default: '' },
  aiEnriched: { type: Boolean, default: false },
});

const slideSchema = new mongoose.Schema({
  slideIndex: { type: Number, required: true },
  slideTitle: { type: String },
  questionsAnswered: { type: Boolean, default: false },
  answers: [answerSchema],
  aiGeneratedContent: { type: String, default: '' },
  previewImageUrl: { type: String, default: '' },
  qualityScore: { type: Number, default: 0 },
  qualitySuggestions: [{ type: String }],
});

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectTitle: { type: String, required: true, trim: true },
    teamName: { type: String, trim: true },
    collegeName: { type: String, default: 'SRKR Engineering College (A)' },
    currentSlide: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    selectedTheme: {
      type: String,
      enum: ['biz-vision-blue', 'minimal-white', 'bold-dark'],
      default: 'biz-vision-blue',
    },
    slides: [slideSchema],
    pptxUrl: { type: String, default: '' },
    shareToken: { type: String, default: '' },
  },
  { timestamps: true }
);

// Initialize 12 empty slides on project creation
projectSchema.pre('save', function () {
  if (this.isNew && this.slides.length === 0) {
    const slideTitles = [
      'Cover / Title Slide',
      'The Problem',
      'The Solution',
      'Product Demo / How It Works',
      'Market Opportunity',
      'Business Model',
      'Traction & Validation',
      'Competitive Landscape',
      'Go-To-Market Strategy',
      'Team',
      'Financials & Roadmap',
      'The Ask / Closing',
    ];
    for (let i = 0; i < 12; i++) {
      this.slides.push({
        slideIndex: i,
        slideTitle: slideTitles[i],
        questionsAnswered: false,
        answers: [],
        aiGeneratedContent: '',
        previewImageUrl: '',
        qualityScore: 0,
        qualitySuggestions: [],
      });
    }
  }
});

module.exports = mongoose.model('Project', projectSchema);
