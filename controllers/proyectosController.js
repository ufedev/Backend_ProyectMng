import Proyectos from "../models/Proyectos.js"
import Tareas from "../models/Tareas.js"
async function obtenerProyectos(req, res) {
  const { usuario } = req

  try {
    const proyectos = await Proyectos.find().where("creador").equals(usuario)

    return res.json(proyectos)
  } catch (e) {
    return res.status(401).json({ msg: "Hubo un Error" })
  }
}
async function crearProyecto(req, res) {
  const proyecto = new Proyectos(req.body)
  proyecto.creador = req.usuario._id
  const guardar = await proyecto.save()
  try {
    res.json(guardar)
  } catch (e) {
    const error = new Error("Hubo un Error")
    res.status(401).json({ msg: error.message })
  }
}
async function obtenerProyecto(req, res) {
  const { id } = req.params

  try {
    const proyecto = await Proyectos.findById(id)
    if (!proyecto) {
      const error = new Error("No encontrado!")
      return res.status(404).json({ msg: error.message })
    }
    if (req.usuario._id.toString() !== proyecto.creador.toString()) {
      const error = new Error("Acceso no permitido")
      return res.status(401).json({ msg: error.message })
    }
    //Obtener Tareas del Proyectos

    const tareas = await Tareas.find().where("proyecto").equals(id)
    const respuesta = {
      proyecto,
      tareas,
    }

    res.json(respuesta)
  } catch (e) {
    const error = new Error("hubo un problema")
    return res.status(401).json({ msg: error.message })
  }
}
async function eliminarProyecto(req, res) {
  const { id } = req.params

  try {
    const proyecto = await Proyectos.findById(id)
    if (!proyecto) {
      const error = new Error("No encontrado!")
      return res.status(404).json({ msg: error.message })
    }
    if (req.usuario._id.toString() !== proyecto.creador.toString()) {
      const error = new Error("Acceso no permitido")
      return res.status(401).json({ msg: error.message })
    }

    await proyecto.deleteOne()
    res.json({ msg: "Proyecto Eliminado" })
  } catch (e) {
    const error = new Error("hubo un problema")
    return res.status(401).json({ msg: error.message })
  }
}
async function editarProyecto(req, res) {
  const { id } = req.params

  try {
    const proyecto = await Proyectos.findById(id)
    if (!proyecto) {
      const error = new Error("No encontrado!")
      return res.status(404).json({ msg: error.message })
    }
    if (req.usuario._id.toString() !== proyecto.creador.toString()) {
      const error = new Error("Acceso no permitido")
      return res.status(401).json({ msg: error.message })
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    const proyectoActualizado = await proyecto.save()
    return res.json(proyectoActualizado)
  } catch (e) {
    const error = new Error("hubo un problema")
    return res.status(401).json({ msg: error.message })
  }
}

async function agregarColaborador(req, res) {
  res.json("desde controller proyecto")
}
async function eliminarColaborador(req, res) {
  res.json("desde controller proyecto")
}

export {
  obtenerProyectos,
  crearProyecto,
  obtenerProyecto,
  eliminarProyecto,
  editarProyecto,
  agregarColaborador,
  eliminarColaborador,
}
