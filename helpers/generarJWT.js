import jwt from "jsonwebtoken"

const generarJWT = (id) => {
  return jwt.sign({ id }, process.env.JSON_KEY, {
    expiresIn: "30d",
  })
}

export default generarJWT
