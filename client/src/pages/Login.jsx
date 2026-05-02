import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      localStorage.setItem("token", data.token)

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      )

      navigate("/dashboard")

    } catch (error) {

      console.log(error)
      alert("Login failed")

    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-[#151821] border border-[#232634] rounded-3xl p-10">

        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Welcome Back
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#0F1117] border border-[#2A2F45] text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#0F1117] border border-[#2A2F45] text-white outline-none"
          />

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition duration-300"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login