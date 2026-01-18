/**
 * Mocked AI Analysis Logic
 * This file simulates AI analysis of feedback.
 * In production, replace with actual Gemini API integration.
 */

export interface AnalysisResult {
  category: string
  priority: 'high' | 'medium' | 'low'
  sentiment: 'positive' | 'neutral' | 'negative'
  summary: string
  language: 'english' | 'hindi' | 'hinglish' | 'other'
  actionable_insight: string
  policy_recommendation: string
}

// Mock categories
const CATEGORIES = ['academic', 'facilities', 'student-life', 'administration', 'safety', 'other']

// Keywords for simple analysis
const PRIORITY_INDICATORS = {
  high: ['urgent', 'critical', 'emergency', 'serious', 'dangerous', 'broken', 'unsafe', 'bekar', 'problem', 'kharab'],
  medium: ['concern', 'issue', 'problem', 'needs', 'should', 'poor', 'difficult', 'theek nahi'],
}

const SENTIMENT_INDICATORS = {
  positive: ['great', 'love', 'excellent', 'amazing', 'wonderful', 'good', 'best', 'perfect', 'thank', 'badhiya', 'acha', 'shandaar'],
  negative: ['bad', 'hate', 'terrible', 'awful', 'worst', 'hate', 'frustrating', 'disappointed', 'bekar', 'kharab', 'bakwas'],
}

const LANGUAGE_INDICATORS = {
  hindi: ['है', 'हैं', 'नहीं', 'करो', 'हो', 'गया', 'लिए'],
  hinglish: ['nahi', 'acha', 'kar', 'raha', 'badhiya', 'bakwas', 'kaise', 'yaar', 'please'],
}

/**
 * Analyzes feedback text and returns AI analysis results
 * Currently uses keyword matching, but can be replaced with Gemini API
 */
export function analyzeFeedback(
  feedbackText: string,
  suggestedCategory?: string
): AnalysisResult {
  const lowerText = feedbackText.toLowerCase()

  // Detect language
  let language: 'english' | 'hindi' | 'hinglish' | 'other' = 'english'
  if (LANGUAGE_INDICATORS.hindi.some(w => feedbackText.includes(w))) {
    language = 'hindi'
  } else if (LANGUAGE_INDICATORS.hinglish.some(w => lowerText.includes(w))) {
    language = 'hinglish'
  }

  // Determine category
  let category = suggestedCategory || 'other'
  if (!suggestedCategory) {
    if (lowerText.includes('class') || lowerText.includes('course') || lowerText.includes('professor') || lowerText.includes('padhai')) {
      category = 'academic'
    } else if (lowerText.includes('building') || lowerText.includes('room') || lowerText.includes('facility') || lowerText.includes('washroom') || lowerText.includes('toilet')) {
      category = 'facilities'
    } else if (lowerText.includes('event') || lowerText.includes('club') || lowerText.includes('social') || lowerText.includes('fest')) {
      category = 'student-life'
    } else if (lowerText.includes('office') || lowerText.includes('registration') || lowerText.includes('admin') || lowerText.includes('fee')) {
      category = 'administration'
    } else if (lowerText.includes('safe') || lowerText.includes('security') || lowerText.includes('dangerous') || lowerText.includes('ragging')) {
      category = 'safety'
    }
  }

  // Determine priority
  let priority: 'high' | 'medium' | 'low' = 'low'
  if (PRIORITY_INDICATORS.high.some((keyword) => lowerText.includes(keyword))) {
    priority = 'high'
  } else if (PRIORITY_INDICATORS.medium.some((keyword) => lowerText.includes(keyword))) {
    priority = 'medium'
  }

  // Determine sentiment
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
  const positiveCount = SENTIMENT_INDICATORS.positive.filter((keyword) =>
    lowerText.includes(keyword)
  ).length
  const negativeCount = SENTIMENT_INDICATORS.negative.filter((keyword) =>
    lowerText.includes(keyword)
  ).length

  if (negativeCount > positiveCount) {
    sentiment = 'negative'
  } else if (positiveCount > negativeCount) {
    sentiment = 'positive'
  }

  // Generate summary
  const summaryLength = Math.min(feedbackText.length, 80)
  const summary = feedbackText.substring(0, summaryLength) + (feedbackText.length > summaryLength ? '...' : '')

  // Generate Actionable Insight and Policy Recommendation (Unique Feature)
  let actionable_insight = "Acknowledge the feedback and monitor for similar reports."
  let policy_recommendation = "Review existing feedback trends for this category."

  if (category === 'academic') {
    if (sentiment === 'negative') {
      actionable_insight = "Schedule a meeting with the department HOD to review teaching methodology."
      policy_recommendation = "Implement a mid-semester anonymous teacher evaluation policy."
    }
  } else if (category === 'facilities') {
    if (priority === 'high') {
      actionable_insight = "Immediately dispatch maintenance team to the reported location."
      policy_recommendation = "Increase frequency of facility audit checks to once every two weeks."
    }
  } else if (category === 'safety') {
    actionable_insight = "Alert campus security and review CCTV footage if applicable."
    policy_recommendation = "Mandate 'Campus Safety' workshops for all students and staff."
  }

  return {
    category,
    priority,
    sentiment,
    summary,
    language,
    actionable_insight,
    policy_recommendation
  }
}

/**
 * Integration point for Gemini API
 * Replace the implementation below with actual API call when ready
 */
export async function analyzeFeatureWithGemini(
  feedbackText: string,
  geminiApiKey?: string
): Promise<AnalysisResult> {
  // Placeholder for future Gemini API integration
  // Example implementation:
  /*
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': geminiApiKey || process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Analyze the following student feedback and provide:
1. Category (academic, facilities, student-life, administration, safety, other)
2. Priority level (high, medium, low)
3. Sentiment (positive, neutral, negative)
4. Brief summary

Feedback: "${feedbackText}"

Respond in JSON format only with keys: category, priority, sentiment, summary`,
        }],
      }],
    }),
  });

  const data = await response.json();
  // Parse and return results
  */

  // For now, use mock analysis
  return analyzeFeedback(feedbackText)
}
