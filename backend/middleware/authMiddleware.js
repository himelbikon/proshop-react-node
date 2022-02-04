import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"

const protect = asyncHandler(async (req, res, next) => {
  let token
  console.log(`${req.headers.authorization}`.yellow)

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]
      console.log(`${token}`.yellow)
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select("-password")

      next()
    } catch (error) {
      console.error(`${error}`.red)
      res.status(401)
      throw new Error(`Not authorized! Token failed!`)
    }
  }

  if (!token) {
    res.status(401)
    throw new Error("Not authorized! No token!")
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error("Not authorized as an admin!")
  }
}

export { protect, admin }
