import { useState } from "react"

function Signup() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async (e) => {

    e.preventDefault()

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      alert(data.message)

    } catch (error) {

      console.log(error)
      alert("Signup failed")

    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-[#151821] border border-[#232634] rounded-3xl p-10">

        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Create Account
        </h1>

        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#0F1117] border border-[#2A2F45] text-white outline-none"
          />

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
            Sign Up
          </button>

        </form>

      </div>

    </div>
  )
}

export default Signup