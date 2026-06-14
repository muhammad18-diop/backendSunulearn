import express from "express";
import { Resend } from "resend";
import pool from "../config/db.js";

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/send-notification", async (req, res) => {
  try {
    const { subject, message } = req.body;

    const users = await pool.query(
      "SELECT email, name FROM users WHERE email IS NOT NULL"
    );

    const results = await Promise.all(
      users.rows.map(async (user) => {
        return resend.emails.send({
          from: "SunuLearn <onboarding@resend.dev>",
          to: user.email,
          subject: subject,
          html: `
            <div style="font-family:Arial,sans-serif">
              <h2>Bonjour ${user.name || ""}</h2>
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
    console.error("Erreur email:", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi",
      error: error.message,
    });
  }
});

export default router;