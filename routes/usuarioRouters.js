import express from "express"
import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  confirmarToken,
  cambiarPassword,
  perfil,
} from "../controllers/usuariosController.js"
import checkAuth from "../middleware/checkAuth.js"
const router = express()

router.post("/", registrar) // crea nuevo user
router.post("/login", autenticar) // autentica el usuario
router.get("/confirmar/:token", confirmar)
router.post("/olvide-password", olvidePassword)
router
  .route("/olvide-password/:token")
  .get(confirmarToken)
  .post(cambiarPassword)

router.get("/perfil", checkAuth, perfil)
export default router
