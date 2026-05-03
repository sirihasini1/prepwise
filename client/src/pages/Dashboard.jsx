import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

function Dashboard() {

  const [interviews, setInterviews] = useState([])

  const navigate = useNavigate()

  const storedUser = localStorage.getItem("user")

  const user = storedUser
    ? JSON.parse(storedUser)
    : null

  const normalizeScore = (score) => {

    if (!score) return 0

    const num =
      parseInt(score.toString().split("/")[0]) || 0

    if (num <= 10) return num

    if (num <= 20)
      return Math.round(num / 2)

    if (num <= 50)
      return Math.round(num / 5)

    if (num <= 100)
      return Math.round(num / 10)

    return 0
  }

  const normalizeScoreDisplay = (score) => {

    const value = normalizeScore(score)

    return `${value}/10`
  }

  const chartData = interviews.map(
    (item, index) => ({

      name: `Interview ${index + 1}`,

      score: normalizeScore(
        item.overallScore
      ),
    })
  )

  const averageRemainingTime =
    interviews.length
      ? Math.floor(

          interviews.reduce(
            (acc, item) =>
              acc +
              (item.remainingTime || 0),
            0
          ) / interviews.length

        )
      : 0

  const bestTime =
    interviews.length
      ? Math.max(

          ...interviews.map(
            (item) =>
              item.remainingTime || 0
          )

        )
      : 0

  const formatAnalyticsTime = (
    seconds
  ) => {

    const mins = Math.floor(
      seconds / 60
    )

    const secs = seconds % 60

    return `${mins}:${
      secs < 10 ? "0" : ""
    }${secs}`
  }

  useEffect(() => {

    if (!user?._id) {

      navigate("/login")
      return
    }

    fetchInterviews()

  }, [])

  const fetchInterviews = async () => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interviews?userId=${user._id}`
      )

      const data =
        await response.json()

      setInterviews(data)

    } catch (error) {

      console.log(error)
    }
  }

  const handleLogout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white px-6 py-12">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="mb-10 flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-bold mb-4">
              Welcome, {user?.name}
            </h1>

            <p className="text-gray-400 text-lg">
              Track your interview performance and progress.
            </p>

            <p className="text-gray-500 mt-2">
              {user?.email}
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

        {/* Analytics Chart */}

        <div className="bg-gradient-to-br from-[#151821] to-[#10131A] border border-[#232634] rounded-3xl p-8 mb-10 shadow-2xl">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-3xl font-bold">
                Performance Analytics
              </h2>

              <p className="text-gray-400 mt-2">
                Track your interview growth over time
              </p>

            </div>

            <div className="bg-[#0F1117] px-5 py-3 rounded-2xl border border-[#232634]">

              <p className="text-sm text-gray-400">
                Total Interviews
              </p>

              <h3 className="text-2xl font-bold">
                {interviews.length}
              </h3>

            </div>

          </div>

          <div className="h-[400px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart data={chartData}>

                <defs>

                  <linearGradient
                    id="colorScore"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#3B82F6"
                      stopOpacity={0.4}
                    />

                    <stop
                      offset="100%"
                      stopColor="#3B82F6"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  stroke="#232634"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                />

                <YAxis
                  stroke="#9CA3AF"
                  domain={[0, 10]}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      "#111827",

                    border:
                      "1px solid #232634",

                    borderRadius: "16px",

                    color: "#fff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="none"
                  fill="url(#colorScore)"
                />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3B82F6"
                  strokeWidth={4}
                  dot={{
                    r: 6,
                    fill: "#3B82F6",
                  }}
                  activeDot={{
                    r: 9,
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Timer Analytics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-[#151821] border border-[#232634] rounded-3xl p-8">

            <p className="text-gray-400 mb-3">
              Average Remaining Time
            </p>

            <h2 className="text-4xl font-bold text-blue-400">
              {formatAnalyticsTime(
                averageRemainingTime
              )}
            </h2>

          </div>

          <div className="bg-[#151821] border border-[#232634] rounded-3xl p-8">

            <p className="text-gray-400 mb-3">
              Best Time Performance
            </p>

            <h2 className="text-4xl font-bold text-green-400">
              {formatAnalyticsTime(
                bestTime
              )}
            </h2>

          </div>

          <div className="bg-[#151821] border border-[#232634] rounded-3xl p-8">

            <p className="text-gray-400 mb-3">
              Time Efficiency
            </p>

            <h2 className="text-3xl font-bold text-purple-400">

              {
                averageRemainingTime >
                600
                  ? "Excellent"
                  : averageRemainingTime >
                    300
                  ? "Good"
                  : "Needs Work"
              }

            </h2>

          </div>

        </div>

        {/* Interview Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {interviews.map(
            (item, index) => (

              <div
                key={index}
                className="bg-[#151821] border border-[#232634] rounded-3xl p-8"
              >

                <div className="flex items-center justify-between mb-6">

                  <h2 className="text-2xl font-bold">
                    {item.role}
                  </h2>

                  <span className="px-4 py-2 rounded-full bg-[#0F1117] border border-[#2A2F45] text-sm">
                    {item.difficulty}
                  </span>

                </div>

                <div className="space-y-4">

                  <div>

                    <p className="text-gray-400 text-sm mb-1">
                      Overall Score
                    </p>

                    <p className="text-4xl font-bold text-green-400">
                      {
                        normalizeScoreDisplay(
                          item.overallScore
                        )
                      }
                    </p>

                  </div>

                  <div className="grid grid-cols-3 gap-4">

                    <div>

                      <p className="text-gray-400 text-xs mb-1">
                        Communication
                      </p>

                      <p className="font-semibold">
                        {
                          normalizeScoreDisplay(
                            item.communication
                          )
                        }
                      </p>

                    </div>

                    <div>

                      <p className="text-gray-400 text-xs mb-1">
                        Technical
                      </p>

                      <p className="font-semibold">
                        {
                          normalizeScoreDisplay(
                            item.technicalKnowledge
                          )
                        }
                      </p>

                    </div>

                    <div>

                      <p className="text-gray-400 text-xs mb-1">
                        Problem Solving
                      </p>

                      <p className="font-semibold">
                        {
                          normalizeScoreDisplay(
                            item.problemSolving
                          )
                        }
                      </p>

                    </div>

                  </div>

                  <div>

                    <p className="text-gray-400 text-sm mb-2">
                      Recommendation
                    </p>

                    <p className="text-gray-300 leading-7">
                      {item.recommendation}
                    </p>

                  </div>

                  <div className="pt-4 border-t border-[#232634]">

                    <p className="text-gray-500 text-sm">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  )
}

export default Dashboard