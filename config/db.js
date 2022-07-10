import mongoose from "mongoose"

const conectarDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })

    const url = `${db.connection.host}:${db.connection.port}`
    console.log(`Mongo db conectado a : ${url}`)
  } catch (e) {
    console.log(`Error: ${e.message}`)
    process.exit(1)
  }
}

export default conectarDB
