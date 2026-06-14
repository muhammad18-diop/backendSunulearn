import express from "express";
import nodemailer from "nodemailer";
import pool from "../config/db.js";

const router = express.Router();

router.post("/send-notification", async (req, res) => {
  try {
    const { subject, message } = req.body;

    const users = await pool.query(
      "SELECT email, name FROM users WHERE email IS NOT NULL"
    );

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        
        rejectUnauthorized: false 
      }
    });

    for (const user of users.rows) {
      await transporter.sendMail({
        from: `"SunuLearn" <${process.env.EMAIL_USER}>`, // Correction de la syntaxe ici
        to: user.email,
        subject,
        html: `
          <div style="font-family:Arial,sans-serif">
            <h2>Bonjour ${user.name || ""}</h2>
            <p>${message}</p>
            <p>L'équipe SunuLearn</p>
          </div>
        `,
      });
    }

    res.json({
      success: true,
      message: `${users.rows.length} emails envoyés`, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi",
    });
  }
});

export default router;