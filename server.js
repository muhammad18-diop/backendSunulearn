import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios"
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import courseRoutes from "./routes/cours.route.js";
import userRoutes from "./routes/userdashboard.route.js"
import userRoutes1 from "./routes/userRoutes..js"
import notification from "./routes/notifications.routes.js"
import db from "./config/db.js"

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

console.log(process.env.PAYDUNYA_MASTER_KEY)


app.get("/", (req, res) => {
    res.send("API fonctionne");
});

console.log("CLOUD NAME =", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API KEY =", process.env.CLOUDINARY_API_KEY);
console.log ("SECRET =", process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING");


const BASE_URL = "https://app.paydunya.com/sandbox-api/v1";



app.post("/api/paydunya/create-payment", async (req, res) => {
    try {
        const { amount, description } = req.body;

        const payload = {
            invoice: {
                total_amount: amount,
                description: description || "Paiement e-learning"
            },
            store: {
                name: "SunuLearn"
            },
            actions: {
                
               return_url: "https://muhammad18-diop.github.io/frontendSunulearn/frontend/programmes.html?payment=success"
            }
        };

        
        const response = await axios.post(
            `${BASE_URL}/checkout-invoice/create`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "PAYDUNYA-MASTER-KEY": process.env.PAYDUNYA_MASTER_KEY,
                    "PAYDUNYA-PRIVATE-KEY": process.env.PAYDUNYA_PRIVATE_KEY,
                    "PAYDUNYA-TOKEN": process.env.PAYDUNYA_TOKEN
                }
            }
        );

        if (response.data.response_code !== "00") {
            console.error(" Refus PayDunya :", response.data.response_text);
            return res.status(400).json({
                success: false,
                message: response.data.response_text
            });
        }

        return res.json({
            success: true,
            payment_url: response.data.response_url, 
            status: response.data.status,
            data: response.data,
            token: response.data.token
        });

        

    } catch (error) {
       
        const errorData = error.response?.data;
        console.error("Erreur API capturée :", errorData || error.message);

        return res.status(500).json({
            success: false,
            message: "Erreur PayDunya : " + (errorData?.response_text || "Identifiants d'API incorrects")
        });
    }
});







const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});