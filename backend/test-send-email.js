import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ override: true });

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const TO = process.env.TEST_TO || EMAIL_USER;

async function run() {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('Missing EMAIL_USER or EMAIL_PASS in environment (.env)');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  try {
    console.log('Verifying transporter (this will attempt to connect to SMTP)...');
    const ok = await transporter.verify();
    console.log('Transporter verified:', ok);
  } catch (err) {
    console.error('Transporter verification failed:', err && err.message);
  }

  try {
    console.log(`Sending test email from ${EMAIL_USER} to ${TO}...`);
    const info = await transporter.sendMail({
      from: `iShop Test <${EMAIL_USER}>`,
      to: TO,
      subject: 'iShop Test Email - OTP delivery check',
      text: 'This is a test message from iShop test-send-email.js',
    });

    console.log('sendMail returned info:', info);
    try {
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) console.log('Preview URL (ethereal):', preview);
    } catch (e) {}
  } catch (err) {
    console.error('sendMail failed:', err && (err.stack || err.message));
  }
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
