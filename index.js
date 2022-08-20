import express from "express"
import dotenv from "dotenv"
import conectarDB from "./config/db.js"
import usuariosRouter from "./routes/usuarioRouters.js"
import proyectosRouter from "./routes/proyectoRouters.js"
import tareasRouter from "./routes/tareasRouters.js"
import cors from "cors"
const app = express()
app.use(express.json())
dotenv.config()
conectarDB()

const whitelist = [process.env.FRONT_URL]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Acceso Denegado"))
    }
  },
}

app.use(cors(corsOptions))
//Routings

app.use("/api/usuarios", usuariosRouter)
app.use("/api/proyectos", proyectosRouter)
app.use("/api/tareas", tareasRouter)
//Servidor
const PORT = process.env.PORT || 8000
const servidor = app.listen(PORT, () => {
  console.log(`servidor corriendo en puerto: ${PORT}`)
})

// import

import { Server } from "socket.io"

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONT_URL,
  },
})

io.on("connection", (socket) => {
  socket.on("abrir proyecto", (id_proyecto) => {
    socket.join(id_proyecto) // Join crea una sala unica para este proyecto.. en este caso...
  })
  socket.on("nueva tarea", (tarea) => {
    const proyecto = tarea.proyecto
    socket.to(proyecto).emit("tarea agregada", tarea)
  })

  socket.on("editar tarea", (tarea) => {
    const proyecto = tarea.proyecto._id
    socket.to(proyecto).emit("tarea editada", tarea)
  })

  socket.on("eliminar tarea", (tarea) => {
    const proyecto = tarea.proyecto._id
    socket.to(proyecto).emit("tarea eliminada", tarea)
  })

  socket.on("cambiar estado", (tarea) => {
    const proyecto = tarea.proyecto._id
    socket.to(proyecto).emit("estado cambiado", tarea)
  })
})
