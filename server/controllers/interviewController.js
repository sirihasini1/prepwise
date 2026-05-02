import Interview from "../models/Interview.js"

export const saveInterview = async (req, res) => {

  try {

    const interview = await Interview.create(req.body)

    res.status(201).json({
      message: "Interview saved successfully",
      interview,
    })

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })
  }
}

export const getInterviews = async (req, res) => {

  try {

    const userId = req.query.userId

    const interviews = await Interview.find({
      userId,
    }).sort({
      createdAt: -1,
    })

    res.status(200).json(interviews)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })
  }
}