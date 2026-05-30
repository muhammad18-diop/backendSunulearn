import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Fonctionne bien");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Serveur lancé sur le port ${PORT}`
    );
});