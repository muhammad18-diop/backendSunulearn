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
import devoirRoute from "./routes/devoir.route.js"
import jwt from "jsonwebtoken"


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
app.use("/api/admin", notification);
app.use("/api/devoirs", devoirRoute)

console.log(process.env.PAYDUNYA_MASTER_KEY)


app.get("/", (req, res) => {
    res.send("API fonctionne");
});

console.log("CLOUD NAME =", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API KEY =", process.env.CLOUDINARY_API_KEY);
console.log ("SECRET =", process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING");


const KPAY_BASE_URL = "https://admin.kpay.site";

const FRONTEND_URL =

    "https://muhammad18-diop.github.io/frontendSunulearn";

// ======================================================

// MIDDLEWARES

// ======================================================

app.use(cors({

    origin: "*"

}));

app.use(express.json());

app.use(express.urlencoded({

    extended: true

}));

// ======================================================

// DATABASE POSTGRESQL

// ======================================================



// ======================================================

// ROUTE TEST

// ======================================================



app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "API SunuLearn fonctionne"

    });

});

// ======================================================

// CREER UN PAIEMENT K-PAY

// ======================================================

// ======================================================
// CONFIGURATION K-PAY
// ======================================================



// ======================================================
// CREER UN PAIEMENT K-PAY
// ======================================================

app.post("/api/kpay/create-payment", async (req, res) => {

    try {

        const { amount, description } = req.body;

        // --------------------------------------------------
        // VERIFIER LE TOKEN
        // --------------------------------------------------

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Token manquant"
            });

        }

        const token = authHeader.split(" ")[1];

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Token invalide"
            });

        }

        // --------------------------------------------------
        // DECODER LE JWT
        // --------------------------------------------------

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const userId = decoded.id;

        console.log("Utilisateur :", userId);


        // --------------------------------------------------
        // VERIFIER LE MONTANT
        // --------------------------------------------------

        if (!amount || Number(amount) <= 0) {

            return res.status(400).json({
                success: false,
                message: "Montant invalide"
            });

        }


        // --------------------------------------------------
        // VERIFIER QUE L'UTILISATEUR EXISTE
        // --------------------------------------------------

   console.log("JWT décodé :", decoded);
console.log("USER ID :", userId);

const userResult = await db.query(
    "SELECT id FROM users WHERE id = $1",
    [userId]
);

console.log("Utilisateur trouvé :", userResult.rows);

if (userResult.rows.length === 0) {
    return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable"
    });
}


        // --------------------------------------------------
        // CREER UN IDENTIFIANT UNIQUE
        // --------------------------------------------------

        const externalId =
            `SUNULEARN-${userId}-${Date.now()}`;


        // --------------------------------------------------
        // CREER LE PAIEMENT CHEZ K-PAY
        // --------------------------------------------------

        const payload = {

            amount: Number(amount),

            externalId: externalId,

            returnUrl:
                `${FRONTEND_URL}/programmes.html?payment=return`,

            cancelUrl:
                `${FRONTEND_URL}/programmes.html?payment=cancel`,

            description:
                description ||
                "Paiement SunuLearn"

        };


        console.log(
            "Payload envoyé à K-PAY :",
            payload
        );


const response = await axios.post(
    `${KPAY_BASE_URL}/api/v1/payments/init`,
    payload,
    {
        headers: {
            "X-API-Key": process.env.KPAY_API_KEY,
            "X-Secret-Key": process.env.KPAY_SECRET_KEY,
            "Content-Type": "application/json"
        }
    }
);

console.log("Réponse complète K-PAY :", response.data);

return res.status(201).json({
    success: true,
    id: response.data.id,
    reference: response.data.reference,
    externalId: response.data.externalId,
    status: response.data.status,
    mode: response.data.mode,
    amount: response.data.amount,
    gatewayUrl: response.data.gatewayUrl,
    expiresAt: response.data.expiresAt
});

        const payment = response.data;


        // --------------------------------------------------
        // VERIFIER GATEWAY URL
        // --------------------------------------------------

        if (!payment.gatewayUrl) {

            console.error(
                "K-PAY n'a pas retourné gatewayUrl"
            );

            return res.status(500).json({

                success: false,

                message:
                    "K-PAY n'a pas retourné l'URL de paiement",

                kpay: payment

            });

        }


        // --------------------------------------------------
        // ENREGISTRER LA TRANSACTION
        // --------------------------------------------------

        await db.query(

            `INSERT INTO payments
            (
                user_id,
                external_id,
                reference,
                amount,
                description,
                status,
                provider
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, $7)`,

            [

                userId,

                externalId,

                payment.reference || null,

                Number(amount),

                description ||
                "Paiement SunuLearn",

                payment.status ||
                "PENDING",

                "KPAY"

            ]

        );


        // --------------------------------------------------
        // REPONSE AU FRONTEND
        // --------------------------------------------------

        return res.status(201).json({

            success: true,

            payment_url:
                payment.gatewayUrl,

            externalId:
                externalId,

            reference:
                payment.reference,

            status:
                payment.status,

            paymentId:
                payment.id

        });


    }

    catch (error) {

        console.error(
            "Erreur création paiement K-PAY :",
            error.response?.data ||
            error.message
        );


        return res.status(
            error.response?.status || 500
        ).json({

            success: false,

            message:
                error.response?.data?.message ||
                error.message ||
                "Erreur K-PAY"

        });

    }

});

// ======================================================

// WEBHOOK KPAY

// ======================================================

app.post(

    "/api/kpay/webhook",

    async (req, res) => {

        try {

            console.log(

                "================================"

            );

            console.log(

                "WEBHOOK KPAY"

            );

            console.log(

                req.body

            );

            console.log(

                "================================"

            );

            // --------------------------------------------------

            // DONNEES RECUES

            // --------------------------------------------------

            const {

                status,

                externalId,

                reference,

                amount,

                metadata

            } = req.body;

            // --------------------------------------------------

            // VERIFIER EXTERNAL ID

            // --------------------------------------------------

            if (!externalId) {

                console.error(

                    "externalId absent"

                );

                return res.sendStatus(400);

            }

            // --------------------------------------------------

            // RECHERCHER LA TRANSACTION

            // --------------------------------------------------

            const paymentResult = await db.query(

                `SELECT *

                 FROM payments

                 WHERE external_id = $1`,

                [externalId]

            );

            if (

                paymentResult.rows.length === 0

            ) {

                console.error(

                    "Transaction inconnue :",

                    externalId

                );

                return res.sendStatus(404);

            }

            const payment =

                paymentResult.rows[0];

            // --------------------------------------------------

            // EVITER DE TRAITER DEUX FOIS LE PAIEMENT

            // --------------------------------------------------

            if (

                payment.status === "COMPLETED"

            ) {

                return res.sendStatus(200);

            }

            // --------------------------------------------------

            // PAIEMENT REUSSI

            // --------------------------------------------------

            if (

                status === "COMPLETED"

            ) {

                // Mise à jour transaction

                await db.query(

                    `UPDATE payments

                     SET

                        status = $1,

                        reference = $2,

                        updated_at = NOW()

                     WHERE external_id = $3`,

                    [

                        "COMPLETED",

                        reference || null,

                        externalId

                    ]

                );

                // --------------------------------------------------

                // ACTIVER LE COMPTE PAYEUR

                // --------------------------------------------------

                await db.query(

                    `UPDATE users

                     SET payer = TRUE

                     WHERE id = $1`,

                    [payment.user_id]

                );

                console.log(

                    `Paiement confirmé pour user ${payment.user_id}`

                );

            }

            // --------------------------------------------------

            // PAIEMENT EN COURS

            // --------------------------------------------------

            else if (

                status === "PENDING" ||

                status === "PROCESSING"

            ) {

                await db.query(

                    `UPDATE payments

                     SET

                        status = $1,

                        updated_at = NOW()

                     WHERE external_id = $2`,

                    [

                        status,

                        externalId

                    ]

                );

            }

            // --------------------------------------------------

            // PAIEMENT ECHOUE

            // --------------------------------------------------

            else if (

                status === "FAILED" ||

                status === "CANCELLED"

            ) {

                await db.query(

                    `UPDATE payments

                     SET

                        status = $1,

                        updated_at = NOW()

                     WHERE external_id = $2`,

                    [

                        status,

                        externalId

                    ]

                );

            }

            return res.sendStatus(200);

        }

        catch (error) {

            console.error(

                "Erreur webhook K-PAY :",

                error

            );

            return res.sendStatus(500);

        }

    }

);

// ======================================================

// WEBHOOK PAIEMENTS

// ======================================================

app.post(

    "/api/kpay/webhook/payment",

    async (req, res) => {

        try {

            console.log(

                "Webhook paiement K-PAY :",

                req.body

            );

            // On utilise le même traitement

            const response =

                await axios.post(

                    `http://localhost:${PORT}/api/kpay/webhook`,

                    req.body,

                    {

                        headers: {

                            "Content-Type":

                                "application/json"

                        }

                    }

                );

            return res.sendStatus(200);

        }

        catch (error) {

            console.error(error);

            return res.sendStatus(500);

        }

    }

);

// ======================================================

// WEBHOOK DEPOTS

// ======================================================

app.post(

    "/api/kpay/webhook/deposit",

    async (req, res) => {

        console.log(

            "Webhook dépôt K-PAY :",

            req.body

        );

        return res.sendStatus(200);

    }

);

// ======================================================

// WEBHOOK REMBOURSEMENT

// ======================================================

app.post(

    "/api/kpay/webhook/refund",

    async (req, res) => {

        try {

            console.log(

                "Webhook remboursement :",

                req.body

            );

            const {

                externalId,

                status

            } = req.body;

            if (externalId) {

                await db.query(

                    `UPDATE payments

                     SET

                        status = $1,

                        updated_at = NOW()

                     WHERE external_id = $2`,

                    [

                        status ||

                        "REFUNDED",

                        externalId

                    ]

                );

            }

            return res.sendStatus(200);

        }

        catch (error) {

            console.error(

                "Erreur remboursement :",

                error

            );

            return res.sendStatus(500);

        }

    }

);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});