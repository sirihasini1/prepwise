import express from "express"

import {
  saveInterview,
  getInterviews
} from "../controllers/interviewController.js"

const router = express.Router()

router.post("/", saveInterview)
router.get("/", getInterviews)

export default router