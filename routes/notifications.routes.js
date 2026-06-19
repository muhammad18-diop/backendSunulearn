import express from "express";
import SibApiV3Sdk from "sib-api-v3-sdk";
import pool from "../config/db.js";

const router = express.Router();


let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

router.post("/send-notification", async (req, res) => {
  try {
    const { subject, message } = req.body;

    const users = await pool.query(
      "SELECT email, name FROM users WHERE email IS NOT NULL"
    );

    const results = await Promise.all(
      users.rows.map((user) => {
        return tranEmailApi.sendTransacEmail({
          sender: {
            email: "mouhamednabidiop18@gmail.com", 
            name: "SunuLearn",
          },
          to: [
            {
              email: user.email,
              name: user.name || "",
            },
          ],
          subject: subject,
          htmlContent: `
            <div style="font-family:Arial">
              <h3>Bonjour ${user.name || ""}</h3>
              <p>${message}</p>
              <p>L'équipe SunuLearn</p>
            </div>
          `,
        });
      })
    );

    res.json({
      success: true,
      message: `${users.rows.length} emails envoyés`,
      results,
    });

  } catch (error) {
    console.error("Erreur Brevo:", error);

    res.status(500).json({
      success: false,
      message: "Erreur envoi email",
      error: error.message,
    });
  }
});

export default router;