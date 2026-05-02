import { Link, useNavigate } from "react-router-dom"

function Navbar() {

  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const handleLogout = () => {

    localStorage.removeItem("token")

    navigate("/login")
  }

  return (
    <nav className="w-full border-b border-[#232634] bg-[#0B0B0F] sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/"
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          PrepWise AI
        </Link>

        {/* Links */}

        <div className="flex items-center gap-6 text-white">

          <Link
            to="/"
            className="hover:text-blue-400 transition"
          >
            Home
          </Link>

          <Link
            to="/interview"
            className="hover:text-blue-400 transition"
          >
            Interview
          </Link>

          <Link
            to="/dashboard"
            className="hover:text-blue-400 transition"
          >
            Dashboard
          </Link>

          {!token ? (

            <>
              <Link
                to="/login"
                className="hover:text-blue-400 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500"
              >
                Sign Up
              </Link>
            </>

          ) : (

            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition"
            >
              Logout
            </button>

          )}

        </div>

      </div>

    </nav>
  )
}

export default Navbar