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
    const guardarTarea = await tarea.save()
    pr.tareas.push(guardarTarea._id)
    await pr.save()
    res.json(tarea)
  } catch (e) {
    const error = new Error("Hubo un error: ")
    res.status(403).json({ msg: error.message })
  }
}
async function obtenerTarea(req, res) {
  const { id } = req.params

  try {
    const tarea = await Tareas.findById(id)
      .populate("proyecto")
      .populate("completado")
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
    tarea.estado = req.body.estado

    const tareaActualizada = await tarea.save()
    res.json(tareaActualizada)
  } catch (e) {
    const error = new Error("Hubo un error: ")
    res.status(403).json({ msg: error.message })
  }
}
async function actualizarEstadoTarea(req, res) {
  const { id } = req.params

  try {
    const tarea = await Tareas.findById(id).populate("proyecto")

    if (!tarea) {
      const error = new Error("Tarea no existente")
      return res.status(404).json({ msg: error.message })
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      if (
        !tarea.proyecto.colaboradores.some(
          (col) => col._id.toString() === req.usuario._id.toString()
        )
      ) {
        const error = new Error("Acceso no permitido")
        return res.status(401).json({ msg: error.message })
      }
    }

    if (
      tarea.estado &&
      req.usuario._id.toString() === tarea.proyecto.creador.toString()
    ) {
      tarea.estado = !tarea.estado
      tarea.completado = null
    } else if (
      !tarea.estado &&
      req.usuario._id.toString() === tarea.proyecto.creador.toString()
    ) {
      tarea.estado = true
      tarea.completado = req.usuario._id
    } else if (
      !tarea.estado &&
      req.usuario._id.toString() !== tarea.proyecto.creador.toString()
    ) {
      tarea.estado = !tarea.estado
      tarea.completado = req.usuario._id
    } else if (
      tarea.estado &&
      req.usuario._id.toString() !== tarea.proyecto.creador.toString()
    ) {
      const error = new Error(
        "Solo el Creador puede modificar una vez completa"
      )
      return res.status(401).json({ msg: error.message })
    }
    await tarea.save()
    const tareaActualizada = await Tareas.findById(id)
      .populate("proyecto")
      .populate("completado")

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

    const tareaEliminada = await tarea.deleteOne()

    const proyecto = await Proyectos.findById(tarea.proyecto._id)
    const proyecto1 = await Proyectos.findById(tarea.proyecto._id).populate(
      "tareas"
    )
    proyecto.tareas = proyecto1.tareas
    await proyecto.save()

    res.json(tareaEliminada)
  } catch (e) {
    const error = new Error("Hubo un error: ")
    res.status(403).json({ msg: error.message })
  }
}

export {
  crearTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  actualizarEstadoTarea,
}
