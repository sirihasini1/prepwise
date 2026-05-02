import mongoose from "mongoose"

const interviewSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  role: {
    type: String,
  },

  difficulty: {
    type: String,
  },

  overallScore: {
    type: String,
  },

  communication: {
    type: String,
  },

  technicalKnowledge: {
    type: String,
  },

  problemSolving: {
    type: String,
  },

  strengths: {
    type: [String],
  },

  improvements: {
    type: [String],
  },

  recommendation: {
    type: String,
  },

}, {
  timestamps: true,
})

const Interview = mongoose.model(
  "Interview",
  interviewSchema
)

export default Interview