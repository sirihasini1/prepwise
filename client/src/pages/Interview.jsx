import { useState, useEffect } from "react"

import {
  generateInterviewQuestions,
  evaluateAnswers
} from "../services/gemini"

function Interview() {

  const [role, setRole] = useState("")
  const [difficulty, setDifficulty] = useState("Easy")

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})

  const [loading, setLoading] = useState(false)

  const [evaluation, setEvaluation] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [timeLeft, setTimeLeft] = useState(900)
  const [timerStarted, setTimerStarted] = useState(false)

  useEffect(() => {

    if (!timerStarted) return

    if (timeLeft <= 0) {

      handleSubmitAnswers()
      return
    }

    const interval = setInterval(() => {

      setTimeLeft((prev) => prev - 1)

    }, 1000)

    return () => clearInterval(interval)

  }, [timeLeft, timerStarted])

  const handleGenerate = async () => {

    if (!role) {

      alert("Please enter a role")
      return
    }

    try {

      setLoading(true)

      const result =
        await generateInterviewQuestions(
          role,
          difficulty
        )

      setQuestions(result)

      setAnswers({})
      setEvaluation(null)

      setTimeLeft(900)
      setTimerStarted(true)

    } catch (error) {

      console.log(error)

      alert("Something went wrong")

    } finally {

      setLoading(false)

    }
  }

  const handleAnswerChange = (
    index,
    value
  ) => {

    setAnswers({
      ...answers,
      [index]: value,
    })
  }

  const formatTime = (seconds) => {

    const mins = Math.floor(seconds / 60)

    const secs = seconds % 60

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleSubmitAnswers = async () => {

    try {

      setSubmitting(true)

      setTimerStarted(false)

      const result =
        await evaluateAnswers(
          role,
          questions,
          answers
        )

      console.log(result)

      setEvaluation(result)

      const user = JSON.parse(
        localStorage.getItem("user")
      )

      await fetch(
        "http://localhost:5000/api/interviews",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            userId: user._id,

            role,
            difficulty,

            overallScore:
              result.overallScore,

            communication:
              result.communication,

            technicalKnowledge:
              result.technicalKnowledge,

            problemSolving:
              result.problemSolving,

            strengths:
              result.strengths,

            improvements:
              result.improvements,

            recommendation:
              result.recommendation,

            remainingTime:
              timeLeft,
          }),
        }
      )

    } catch (error) {

      console.log(error)

      alert(
        "Failed to evaluate answers"
      )

    } finally {

      setSubmitting(false)

    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white px-6 py-12">

      <div className="max-w-5xl mx-auto">

        {/* Setup */}

        <div className="bg-[#151821] border border-[#232634] p-10 rounded-3xl">

          <h1 className="text-4xl font-bold mb-8">
            AI Mock Interview
          </h1>

          <div className="space-y-5">

            <input
              type="text"
              placeholder="Enter Role"
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-[#0F1117] border border-[#2A2F45] outline-none"
            />

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-xl bg-[#0F1117] border border-[#2A2F45] outline-none"
            >

              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>

            </select>

            <button
              onClick={handleGenerate}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 font-semibold hover:scale-[1.01] transition"
            >

              {
                loading
                  ? "Generating..."
                  : "Generate Questions"
              }

            </button>

          </div>

        </div>

        {/* Timer */}

        {timerStarted && (

          <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                Interview Timer
              </h2>

              <p className="text-white/80 mt-2">
                Real interview simulation
              </p>

            </div>

            <div className="text-5xl font-bold">
              {formatTime(timeLeft)}
            </div>

          </div>

        )}

        {/* Questions */}

        {questions.length > 0 && (

          <div className="mt-10 space-y-6">

            {questions.map(
              (question, index) => (

                <div
                  key={index}
                  className="bg-[#151821] border border-[#232634] rounded-3xl p-8"
                >

                  <h2 className="text-2xl font-semibold mb-5">
                    Question {index + 1}
                  </h2>

                  <p className="text-gray-300 mb-6 leading-8">
                    {question}
                  </p>

                  <textarea
                    rows="5"
                    placeholder="Type your answer here..."
                    value={
                      answers[index] || ""
                    }
                    onChange={(e) =>
                      handleAnswerChange(
                        index,
                        e.target.value
                      )
                    }
                    className="w-full p-5 rounded-2xl bg-[#0F1117] border border-[#2A2F45] outline-none resize-none"
                  />

                </div>

              )
            )}

            <button
              onClick={handleSubmitAnswers}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-lg font-semibold hover:scale-[1.01] transition"
            >

              {
                submitting
                  ? "Evaluating..."
                  : "Submit Answers"
              }

            </button>

          </div>

        )}

        {/* Results */}

        {evaluation && (

          <div className="mt-12 space-y-8">

            {/* Score */}

            <div className="bg-[#151821] border border-[#232634] rounded-3xl p-8">

              <h2 className="text-4xl font-bold mb-6">
                Interview Scorecard
              </h2>

              <div className="text-6xl font-bold text-green-400">
                {evaluation?.overallScore}
              </div>

            </div>

            {/* Skills */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-[#151821] border border-[#232634] rounded-3xl p-6">

                <h3 className="text-xl font-semibold mb-3">
                  Communication
                </h3>

                <p className="text-4xl font-bold text-blue-400">
                  {evaluation?.communication}
                </p>

              </div>

              <div className="bg-[#151821] border border-[#232634] rounded-3xl p-6">

                <h3 className="text-xl font-semibold mb-3">
                  Technical Knowledge
                </h3>

                <p className="text-4xl font-bold text-purple-400">
                  {
                    evaluation?.technicalKnowledge
                  }
                </p>

              </div>

              <div className="bg-[#151821] border border-[#232634] rounded-3xl p-6">

                <h3 className="text-xl font-semibold mb-3">
                  Problem Solving
                </h3>

                <p className="text-4xl font-bold text-pink-400">
                  {evaluation?.problemSolving}
                </p>

              </div>

            </div>

            {/* Strengths & Improvements */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-[#151821] border border-[#232634] rounded-3xl p-8">

                <h3 className="text-2xl font-bold mb-5 text-green-400">
                  Strengths
                </h3>

                <ul className="space-y-3 text-gray-300">

                  {
                    evaluation?.strengths?.map(
                      (item, index) => (
                        <li key={index}>
                          ✔ {item}
                        </li>
                      )
                    )
                  }

                </ul>

              </div>

              <div className="bg-[#151821] border border-[#232634] rounded-3xl p-8">

                <h3 className="text-2xl font-bold mb-5 text-red-400">
                  Improvements
                </h3>

                <ul className="space-y-3 text-gray-300">

                  {
                    evaluation?.improvements?.map(
                      (item, index) => (
                        <li key={index}>
                          ✘ {item}
                        </li>
                      )
                    )
                  }

                </ul>

              </div>

            </div>

            {/* Recommendation */}

            <div className="bg-[#151821] border border-[#232634] rounded-3xl p-8">

              <h3 className="text-2xl font-bold mb-5">
                Recommendation
              </h3>

              <p className="text-gray-300 leading-8">
                {evaluation?.recommendation}
              </p>

            </div>

            {/* Question Analysis */}

            <div className="space-y-6">

              {(evaluation?.questionAnalysis || []).map(
                (item, index) => (

                  <div
                    key={index}
                    className="bg-[#151821] border border-[#232634] rounded-3xl p-8"
                  >

                    <h2 className="text-2xl font-bold mb-5">
                      Question {index + 1}
                    </h2>

                    <p className="text-gray-300 mb-6 leading-8">
                      {item?.question}
                    </p>

                    <div className="mb-6">

                      <h3 className="text-lg font-semibold mb-3 text-blue-400">
                        Your Answer
                      </h3>

                      <p className="text-gray-300 leading-8 whitespace-pre-wrap">
                        {item?.userAnswer}
                      </p>

                    </div>

                    <div className="mb-6">

                      <h3 className="text-lg font-semibold mb-3 text-yellow-400">
                        AI Feedback
                      </h3>

                      <p className="text-gray-300 leading-8 whitespace-pre-wrap">
                        {item?.feedback}
                      </p>

                    </div>

                    <div>

                      <h3 className="text-lg font-semibold mb-3 text-green-400">
                        Correct Explanation
                      </h3>

                      <p className="text-gray-300 leading-8 whitespace-pre-wrap">
                        {item?.correctAnswer}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>

    </div>
  )
}

export default Interview