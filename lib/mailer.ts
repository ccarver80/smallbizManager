import nodemailer from "nodemailer";

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    })
  : null;

export async function sendMail(options: { to: string; subject: string; text: string }) {
  if (!transporter) {
    console.log("[mailer] SMTP not configured yet, skipping send:", options);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? "no-reply@example.com",
    ...options,
  });
}
