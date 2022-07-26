import mongoose from "mongoose"
import bcrypt from "bcrypt"
const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt) // remarca el await pero es un error del IDE, sin el await no hashea el password correctamente.
})

usuarioSchema.methods.comprobarPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}
const Usuarios = mongoose.model("Usuarios", usuarioSchema)

export default Usuarios
