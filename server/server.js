import interviewRoutes from "./routes/interviewRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/interviews", interviewRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected 🚀")
  })
  .catch((error) => {
    console.log("MongoDB Error:", error)
  })

app.get("/", (req, res) => {
  res.send("PrepWise AI Backend Running 🚀")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})