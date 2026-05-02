const API_URL =
  "https://api.groq.com/openai/v1/chat/completions"

const API_KEY =
  import.meta.env.VITE_GROQ_API_KEY

const normalizeScore = (score) => {

  if (!score) return "0/10"

  const num =
    parseInt(score.toString().split("/")[0]) || 0

  if (num <= 10) return `${num}/10`

  if (num <= 20)
    return `${Math.round(num / 2)}/10`

  if (num <= 50)
    return `${Math.round(num / 5)}/10`

  if (num <= 100)
    return `${Math.round(num / 10)}/10`

  return "0/10"
}

export const generateInterviewQuestions = async (
  role,
  difficulty
) => {

  try {

    const prompt = `
Generate exactly 5 interview questions for a ${role} role.

Difficulty: ${difficulty}

Return ONLY a valid JSON array.

Example:
[
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4",
  "Question 5"
]
`

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },

      body: JSON.stringify({

        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content:
              "Return ONLY valid JSON."
          },

          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.5,

        max_tokens: 2000,
      }),
    })

    const data = await response.json()

    const text =
      data?.choices?.[0]?.message?.content || "[]"

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    return JSON.parse(cleaned)

  } catch (error) {

    console.log(error)

    return []
  }
}

export const evaluateAnswers = async (
  role,
  questions,
  answers
) => {

  try {

    const formattedAnswers =
      questions.map((question, index) => ({

        question,

        answer:
          answers[index] ||
          "No answer provided",
      }))

    const prompt = `
You are a STRICT AI interview evaluator.

IMPORTANT RULES:
- Wrong answers: 1-3/10
- Weak answers: 4-5/10
- Average answers: 6-7/10
- Strong answers: 8-9/10
- Excellent answers: 10/10

IMPORTANT:
- ALL scores MUST be OUT OF 10 ONLY
- NEVER use /50 or /100
- questionAnalysis MUST contain EXACTLY 5 items
- Analyze ALL questions individually

Return ONLY valid JSON.

FORMAT:

{
  "overallScore": "5/10",

  "communication": "5/10",

  "technicalKnowledge": "4/10",

  "problemSolving": "5/10",

  "strengths": [
    "Strength 1",
    "Strength 2"
  ],

  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ],

  "recommendation":
    "Final recommendation.",

  "questionAnalysis": [
    {
      "question": "Question",

      "userAnswer": "Answer",

      "feedback":
        "Detailed feedback.",

      "correctAnswer":
        "Correct explanation."
    }
  ]
}

Role:
${role}

Candidate Answers:
${JSON.stringify(formattedAnswers)}
`

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },

      body: JSON.stringify({

        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content:
              "Return ONLY valid JSON with EXACTLY 5 questionAnalysis objects and ALL scores out of 10."
          },

          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.6,

        max_tokens: 4000,
      }),
    })

    const data = await response.json()

    const text =
      data?.choices?.[0]?.message?.content || "{}"

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    let parsed = JSON.parse(cleaned)

    parsed.overallScore =
      normalizeScore(parsed.overallScore)

    parsed.communication =
      normalizeScore(parsed.communication)

    parsed.technicalKnowledge =
      normalizeScore(
        parsed.technicalKnowledge
      )

    parsed.problemSolving =
      normalizeScore(
        parsed.problemSolving
      )

    if (
      !parsed.questionAnalysis ||
      !Array.isArray(
        parsed.questionAnalysis
      )
    ) {

      parsed.questionAnalysis = []
    }

    parsed.questionAnalysis =
      questions.map((question, index) => {

        const existing =
          parsed.questionAnalysis[index]

        return {

          question,

          userAnswer:
            answers[index] ||
            "No answer provided",

          feedback:
            existing?.feedback ||
            "Your answer needs more clarity, technical depth, and practical explanation.",

          correctAnswer:
            existing?.correctAnswer ||
            "A strong answer should include accurate concepts, examples, and proper technical explanation.",
        }
      })

    return parsed

  } catch (error) {

    console.log(error)

    return {

      overallScore: "0/10",

      communication: "0/10",

      technicalKnowledge: "0/10",

      problemSolving: "0/10",

      strengths: [],

      improvements: [],

      recommendation:
        "Unable to evaluate interview.",

      questionAnalysis:
        questions.map(
          (question, index) => ({

            question,

            userAnswer:
              answers[index] || "",

            feedback:
              "Evaluation failed.",

            correctAnswer:
              "Unavailable.",
          })
        ),
    }
  }
}