import axios from "axios";
import nodemailer from "nodemailer";

const RESEND_API_URL = "https://api.resend.com/emails";
const API_KEY = process.env.RESEND_API_KEY;

if (!API_KEY) {
  console.warn("RESEND_API_KEY not set. Resend will fail until configured.");
}

/**
 * Send email via Resend API. In non-production, falls back to Ethereal (nodemailer) and
 * returns an object containing `previewUrl` for developer preview.
 * @param {{from:string,to:string,subject:string,html:string}} param0
 */
export async function sendEmailResend({ from, to, subject, html }) {
  // Try Resend first (if API key present)
  if (API_KEY) {
    try {
      const payload = { from, to, subject, html };
      const resp = await axios.post(RESEND_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      return { provider: "resend", data: resp.data };
    } catch (err) {
      console.error("sendEmailResend: Resend send failed:", err && (err.response?.data || err.message || err));
      // fall through to ethereal in non-production
      if (process.env.NODE_ENV === "production") {
        // In production, propagate the original error
        throw err;
      }
    }
  }

  // Development fallback: create an Ethereal test account and send via SMTP
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({ from, to, subject, html });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    return { provider: "ethereal", previewUrl, messageId: info.messageId, raw: info };
  } catch (fallbackErr) {
    console.error("sendEmailResend: Ethereal fallback failed:", fallbackErr);
    throw fallbackErr;
  }
}
