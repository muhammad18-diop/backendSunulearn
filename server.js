import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import courseRoutes from "./routes/cours.route.js";
import userRoutes from "./routes/userdashboard.route.js"
import userRoutes1 from "./routes/userRoutes..js"
import notification from "./routes/notifications.routes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/utilisateurs", userRoutes)
app.use("/uploads", express.static("uploads"))
app.use("/api/user", userRoutes1);
app.use("/api/admin", notification)


app.get("/", (req, res) => {
    res.send("API fonctionne");
});

console.log("CLOUD NAME =", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API KEY =", process.env.CLOUDINARY_API_KEY);
console.log("SECRET =", process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});