import mongoose from "mongoose"

const proyectosSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
      required: true,
    },
    fechaEntrega: {
      type: Date,
      default: Date.now(),
    },
    cliente: {
      type: String,
      trim: true,
      required: true,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
    },
    tareas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tareas",
      },
    ],
    colaboradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuarios",
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Proyectos = mongoose.model("Proyectos", proyectosSchema)

export default Proyectos
