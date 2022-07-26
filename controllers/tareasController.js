import Tareas from "../models/Tareas.js"
import Proyectos from "../models/Proyectos.js"

async function crearTarea(req, res) {
  const { proyecto } = req.body

  try {
    const pr = await Proyectos.findById(proyecto)
    if (!pr) {
      const error = new Error("El proyecto no existe")
      return res.status(404).json({ msg: error.message })
    }
    if (pr.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("No tienes Los permisos")
      return res.status(401).json({ msg: error.message })
    }

    const tarea = new Tareas(req.body)
    const guardar = await tarea.save()
    res.json(guardar)
  } catch (e) {
    const error = new Error("Hubo un error: ")
    res.status(403).json({ msg: error.message })
  }
}
async function obtenerTarea(req, res) {
  const { id } = req.params

  try {
    const tarea = await Tareas.findById(id).populate("proyecto")
    if (!tarea) {
      const error = new Error("Tarea no existente")
      return res.status(404).json({ msg: error.message })
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Faltan los Permisos")
      return res.status(401).json({ msg: error.message })
    }

    res.json(tarea)
  } catch (e) {
    const error = new Error("Hubo un error: ")
    res.status(403).json({ msg: error.message })
  }
}
async function actualizarTarea(req, res) {
  const { id } = req.params

  try {
    const tarea = await Tareas.findById(id).populate("proyecto")
    if (!tarea) {
      const error = new Error("Tarea no existente")
      return res.status(404).json({ msg: error.message })
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Faltan los Permisos")
      return res.status(401).json({ msg: error.message })
    }

    tarea.nombre = req.body.nombre || tarea.nombre
    tarea.descripcion = req.body.descripcion || tarea.descripcion
    tarea.prioridad = req.body.prioridad || tarea.prioridad
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega
    tarea.estado = req.body.estado || tarea.estado

    const tareaActualizada = await tarea.save()
    res.json(tareaActualizada)
  } catch (e) {
    const error = new Error("Hubo un error: ")
    res.status(403).json({ msg: error.message })
  }
}
async function eliminarTarea(req, res) {
  const { id } = req.params

  try {
    const tarea = await Tareas.findById(id).populate("proyecto")
    if (!tarea) {
      const error = new Error("Tarea no existente")
      return res.status(404).json({ msg: error.message })
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Faltan los Permisos")
      return res.status(401).json({ msg: error.message })
    }

    await tarea.deleteOne()
    res.json({ msg: "Tarea Eliminada" })
  } catch (e) {
    const error = new Error("Hubo un error: ")
    res.status(403).json({ msg: error.message })
  }
}
async function cambiarEstado(req, res) {}

export {
  crearTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
}
