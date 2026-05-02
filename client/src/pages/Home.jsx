import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-[#1F2230]">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          PrepWise AI
        </h1>

        <Link
          to="/interview"
          className="px-5 py-2 rounded-xl bg-[#151821] border border-[#2A2F45] hover:bg-[#1B2030] transition"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">

        <h1 className="text-6xl md:text-7xl font-bold leading-tight max-w-5xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Crack Interviews Smarter with AI
        </h1>

        <p className="text-gray-400 text-lg mt-6 max-w-2xl">
          Practice mock interviews, receive AI-powered feedback,
          improve communication, and boost confidence.
        </p>

        <Link
          to="/interview"
          className="mt-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition duration-300 font-semibold text-lg shadow-lg"
        >
          Start Interview
        </Link>

      </section>

      {/* Features */}
      <section className="px-8 pb-24">

        <h2 className="text-3xl font-bold text-center mb-14">
          Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="bg-[#151821] border border-[#232634] rounded-3xl p-8 hover:-translate-y-2 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4">
              AI Questions
            </h3>

            <p className="text-gray-400">
              Generate interview questions based on your selected role and difficulty.
            </p>
          </div>

          <div className="bg-[#151821] border border-[#232634] rounded-3xl p-8 hover:-translate-y-2 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4">
              Smart Feedback
            </h3>

            <p className="text-gray-400">
              Receive AI-powered evaluation, suggestions, and answer improvements.
            </p>
          </div>

          <div className="bg-[#151821] border border-[#232634] rounded-3xl p-8 hover:-translate-y-2 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4">
              Score Analysis
            </h3>

            <p className="text-gray-400">
              Track your interview performance with detailed scoring insights.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}

export default Home