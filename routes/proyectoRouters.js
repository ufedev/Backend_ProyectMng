import express from "express"
import {
  obtenerProyectos,
  crearProyecto,
  obtenerProyecto,
  eliminarProyecto,
  editarProyecto,
  agregarColaborador,
  eliminarColaborador,
} from "../controllers/proyectosController.js"
import checkAuth from "../middleware/checkAuth.js"
const router = express()

router
  .route("/")
  .get(checkAuth, obtenerProyectos)
  .post(checkAuth, crearProyecto)

router
  .route("/:id")
  .get(checkAuth, obtenerProyecto)
  .put(checkAuth, editarProyecto)
  .delete(checkAuth, eliminarProyecto)

router.post("/agregar-colaborador/:id", checkAuth, agregarColaborador)
router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborador)

export default router
