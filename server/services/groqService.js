const Groq = require('groq-sdk');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL  = 'llama-3.3-70b-versatile';

// Hard word trimmer
const tw = (str, max) => {
  if (!str) return '';
  return str.trim().split(/\s+/).slice(0, max).join(' ');
};

/**
 * USE CASE 1 — Transform user answers into creative, impactful slide content.
 * Groq acts as a pitch deck writer: creative language, all facts preserved,
 * every field sized to fit perfectly on the slide.
 */
const enrichSlideContent = async (slideIndex, slideTitle, answers) => {
  const answersText = answers
    .map((a, i) => `Answer ${i + 1}: ${a?.answer || '(not provided)'}`)
    .join('\n');

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are an expert pitch deck writer for a top startup accelerator in India.
You take raw student answers and craft them into powerful, investor-ready slide content.

YOUR GOALS:
1. Make every word count — punchy, bold, and impactful language.
2. Keep ALL facts, numbers, names, and statistics from the student's answers. Do NOT drop or change them.
3. Elevate the language — make it sound professional and exciting without losing authenticity.
4. Each field must STRICTLY fit within its word limit to display correctly on the slide:
   - "headline": EXACTLY 6–10 words — bold action phrase that grabs attention
   - "bullets": EXACTLY 3–4 items, each EXACTLY 10–15 words — crisp, clear, specific
   - "callout": EXACTLY 6–10 words — one powerful stat, number, or bold claim
   - "subtext": EXACTLY 15–20 words — one polished sentence with key context
5. No vague filler — every sentence should say something real and specific.
6. Return ONLY valid JSON. No markdown, no extra keys.`,
      },
      {
        role: 'user',
        content: `Write creative, investor-ready content for Slide ${slideIndex + 1}: "${slideTitle}".

Student's raw answers:
${answersText}

Return JSON — all word limits must be met exactly:
{
  "headline": "6–10 words, bold and impactful",
  "bullets": [
    "10–15 words, specific and clear",
    "10–15 words, specific and clear",
    "10–15 words, specific and clear"
  ],
  "subtext": "15–20 words, one polished sentence",
  "callout": "6–10 words, one standout stat or claim"
}`,
      },
    ],
    temperature: 0.72,   // creative but controlled
    max_tokens: 700,
    response_format: { type: 'json_object' },
  });

  const raw     = completion.choices[0].message.content.trim();
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed  = JSON.parse(cleaned);

  // Hard trim as safety net
  return {
    headline: tw(parsed.headline, 10),
    bullets:  (parsed.bullets || []).slice(0, 4).map(b => tw(b, 15)),
    subtext:  tw(parsed.subtext, 20),
    callout:  tw(parsed.callout, 10),
  };
};

/**
 * USE CASE 2 — Generate a hint example for a specific question
 */
const generateHint = async (question, slideTitle) => {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'user',
        content: `Give a 1-2 sentence example answer to this pitch deck question for the "${slideTitle}" slide:

"${question}"

Make it sound like a real student startup founder from India. Keep it brief, practical, and inspiring. Return only the example answer, no preamble.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 256,
  });

  return completion.choices[0].message.content.trim();
};

/**
 * USE CASE 3 — Validate slide content and give quality score
 */
const validateSlideContent = async (slideTitle, enrichedContent) => {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'user',
        content: `Review this slide content for a student pitch deck (Slide: "${slideTitle}").
Identify any missing critical information and give 2 short suggestions to improve it.

Slide content:
${JSON.stringify(enrichedContent, null, 2)}

Return ONLY valid JSON with this exact structure:
{
  "score": 7,
  "suggestions": ["suggestion 1", "suggestion 2"]
}

Score from 1-10. Do not include markdown formatting or code fences.`,
      },
    ],
    temperature: 0.5,
    max_tokens: 512,
    response_format: { type: 'json_object' },
  });

  const raw     = completion.choices[0].message.content.trim();
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
};

module.exports = { enrichSlideContent, generateHint, validateSlideContent };
