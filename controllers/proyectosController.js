import Proyectos from "../models/Proyectos.js"
import Tareas from "../models/Tareas.js"
import Usuarios from "../models/Usuarios.js"
async function obtenerProyectos(req, res) {
  const { usuario } = req

  try {
    const proyectos = await Proyectos.find({
      $or: [{ colaboradores: { $in: usuario } }, { creador: { $in: usuario } }],
    }).select("-tareas")

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
      .populate({
        path: "tareas",
        populate: { path: "completado", select: "nombre" },
      })
      .populate("colaboradores", "email nombre") // de esta forma con populate seleccionamos los campos que queremos traer, por implicito trae el _id
    if (!proyecto) {
      const error = new Error("No encontrado!")
      return res.status(404).json({ msg: error.message })
    }
    if (req.usuario._id.toString() !== proyecto.creador.toString()) {
      if (
        !proyecto.colaboradores.some(
          (col) => col._id.toString() === req.usuario._id.toString()
        )
      ) {
        const error = new Error("Acceso no permitido")
        return res.status(401).json({ msg: error.message })
      }
    }
    //Obtener Tareas del Proyectos

    //const tareas = await Tareas.find().where("proyecto").equals(id)

    res.json(proyecto)
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

async function buscarColaborador(req, res) {
  const { email } = req.body
  try {
    const usuario = await Usuarios.findOne({ email }).select(
      "-confirmado -createdAt -password -token -updatedAt -__v"
    )
    if (!usuario) {
      const error = new Error("Usuario no encontrado")
      return res.status(404).json({ msg: error.message })
    }
    res.json(usuario)
  } catch (error) {
    const er = new Error("Usuario no encontrado")
    return res.status(404).json({ msg: er.message })
  }
}
async function agregarColaborador(req, res) {
  const { id } = req.params
  const { email } = req.body
  try {
    const proyecto = await Proyectos.findById(id)

    if (!proyecto) {
      const error = new Error("el proyecto no existe")
      return res.status(404).json({ msg: error.message })
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      return res.status(401).json({ msg: "Accion no valida" })
    }
    const usuario = await Usuarios.findOne({ email })
    if (usuario._id.toString() === req.usuario._id.toString()) {
      return res.status(401).json({ msg: "Ya es Propietario del proyecto" })
    }
    if (proyecto.colaboradores.includes(usuario._id)) {
      const error = new Error("Ya se encuentra al Proyecto")
      return res.status(401).json({ msg: error.message })
    }

    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    res.json({ msg: "Colaborador Agregado!" })
  } catch (er) {
    const error = new Error("hubo un error")
    return res.status(404).json({ msg: error.message })
  }
}
async function eliminarColaborador(req, res) {
  const { id } = req.params
  const { colaborador } = req.body
  try {
    const proyecto = await Proyectos.findById(id)

    if (!proyecto) {
      const error = new Error("el proyecto no existe")
      return res.status(404).json({ msg: error.message })
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      return res.status(401).json({ msg: "Accion no valida" })
    }

    const colaboradoresActualizados = proyecto.colaboradores.filter(
      (col) => col.toString() !== colaborador._id.toString()
    )

    proyecto.colaboradores = colaboradoresActualizados

    await proyecto.save()
    return res.json({
      msg: "Colaborador Eliminado",
    })
  } catch (er) {
    const error = new Error("hubo un error")
    return res.status(404).json({ msg: error.message })
  }
}

export {
  obtenerProyectos,
  crearProyecto,
  obtenerProyecto,
  eliminarProyecto,
  editarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
}
