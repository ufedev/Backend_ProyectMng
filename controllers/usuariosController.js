import Usuarios from "../models/Usuarios.js"
import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"
import { emailConfirmar, emailRestablecer } from "../helpers/emails.js"
async function registrar(req, res) {
  //evitar duplicación
  const { email } = req.body
  const existeUsuario = await Usuarios.findOne({ email })

  if (existeUsuario) {
    const error = new Error("El usuario ya existe")
    return res.status(403).json({ msg: error.message })
  }
  try {
    const usuario = new Usuarios(req.body)
    usuario.token = generarId()
    await usuario.save()
    emailConfirmar({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    })
    res.json({ msg: "Usuario creado correctamente, Verifique su Email" })
  } catch (e) {}
}

async function autenticar(req, res) {
  //extraemos los datos de la solicitud
  const { email, password } = req.body
  //si existe usuario
  const usuario = await Usuarios.findOne({ email })

  if (!usuario) {
    const error = new Error("El usuario no existe")
    return res.status(404).json({ msg: error.message })
  }

  //si esta confirmado usuario
  if (!usuario.confirmado) {
    const error = new Error("La cuenta no ha sido confirmada, revise su Email")
    return res.status(403).json({ msg: error.message })
  }
  //comprobar password
  if (!(await usuario.comprobarPassword(password))) {
    const error = new Error("Usuario o Contraseña incorrectos")
    return res.status(403).json({ msg: error.message })
  }

  res.status(200).json({
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    token: generarJWT(usuario._id),
  })
}

async function confirmar(req, res) {
  const { token } = req.params

  const usuarioConfirmado = await Usuarios.findOne({ token })

  try {
    usuarioConfirmado.token = ""
    usuarioConfirmado.confirmado = true
    const confirmado = await usuarioConfirmado.save()
    if (confirmado) {
      res.json({ msg: "Usuario confirmado" })
    }
  } catch (e) {
    const error = new Error("Token no Válido")
    res.status(403).json({ msg: error.message })
  }
}

async function olvidePassword(req, res) {
  const { email } = req.body

  //si existe usuario
  const usuario = await Usuarios.findOne({ email })

  if (!usuario) {
    const error = new Error("El usuario no existe")
    return res.status(401).json({ msg: error.message })
  }

  try {
    usuario.token = generarId()
    await usuario.save()
    emailRestablecer({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    })
    res.json({ msg: "Se ha enviado un correo a su Email" })
  } catch (e) {
    console.log(e)
  }
}

async function confirmarToken(req, res) {
  const { token } = req.params

  const tokenValido = await Usuarios.findOne({ token })

  if (tokenValido) {
    return res.json({ msg: "Token Válido" })
  } else {
    return res.status(403).json({ msg: "Token no válido" })
  }
}

async function cambiarPassword(req, res) {
  const { token } = req.params
  const { password } = req.body
  try {
    const user = await Usuarios.findOne({ token })

    if (user) {
      user.password = password
      user.token = ""
      await user.save()
      res.json({ msg: "Contraseña modificada correctamente" })
    } else {
      res.status(403).json({ msg: "Token no válido" })
    }
  } catch (e) {
    const error = new Error("Token no válido")
    res.status(403).json({ msg: error.message })
  }
}

async function perfil(req, res) {
  res.json(req.usuario)
}

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  confirmarToken,
  cambiarPassword,
  perfil,
}
