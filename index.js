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

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Acceso Denegado"))
    }
  },
}

app.use(cors())
//Routings

app.use("/api/usuarios", usuariosRouter)
app.use("/api/proyectos", proyectosRouter)
app.use("/api/tareas", tareasRouter)
//Servidor
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`servidor corriendo en puerto: ${PORT}`)
})
