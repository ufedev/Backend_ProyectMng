import jwt from "jsonwebtoken"
import Usuarios from "../models/Usuarios.js"
const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization

  if (token && token.startsWith("Bearer")) {
    try {
      const decode = jwt.verify(token.split(" ")[1], process.env.JSON_KEY)

      const user = await Usuarios.findById(decode.id).select(
        "-password -token -confirmado -createdAt -updatedAt -__v"
      )

      req.usuario = user

      next()
    } catch (e) {
      const error = new Error("hubo un problema")
      res.status(401).json({ msg: error.message })
    }
  }

  if (!token) {
    const error = new Error("Token no válido")

    res.status(401).json({ msg: error.message })
  }
}

export default checkAuth
