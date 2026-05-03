import interviewRoutes from "./routes/interviewRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const app = express()

// Middleware
app.use(
  cors({
    origin: "*",
  })
)

app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/interviews", interviewRoutes)

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected 🚀")
  })
  .catch((error) => {
    console.log("MongoDB Error:", error)
  })

// Test Route
app.get("/", (req, res) => {
  res.send("PrepWise AI Backend Running 🚀")
})

// Port
const PORT = process.env.PORT || 5000

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})