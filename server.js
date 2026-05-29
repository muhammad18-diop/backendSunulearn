import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from './routes/auth.routes.js'

dotenv.config()

const app = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
    res.send("Fonctionne Bien")
})

app.listen(3000, () => {
    console.log(`Serveur lancé sur le port ${process.env.PORT}`)
})