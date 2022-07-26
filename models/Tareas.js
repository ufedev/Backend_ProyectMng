import mongoose from "mongoose"

const tareasSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    fechaEntrega: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    prioridad: {
      type: String,
      required: true,
      enum: ["Baja", "Media", "Alta"],
    },
    estado: {
      type: Boolean,
      default: false,
    },
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyectos",
    },
  },
  { timestamps: true }
)

const Tareas = mongoose.model("Tareas", tareasSchema)

export default Tareas
