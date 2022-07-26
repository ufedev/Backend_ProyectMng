import express from "express"
import {
  crearTarea,
  obtenerTarea,
  eliminarTarea,
  actualizarTarea,
  cambiarEstado,
} from "../controllers/tareasController.js"

import checkAuth from "../middleware/checkAuth.js"

const router = express()

//router.route("/").get(checkAuth, obtenerTareas)
router.post("/", checkAuth, crearTarea)
router
  .route("/:id")
  .get(checkAuth, obtenerTarea)
  .put(checkAuth, actualizarTarea)
  .delete(checkAuth, eliminarTarea)

router.post("/estado/:id", cambiarEstado)
export default router
