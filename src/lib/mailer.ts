import nodemailer from "nodemailer";

export const mailer = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter;
};

export async function sendMail(to: string, subject: string, html: string) {
  const transporter = mailer();
  const from = process.env.MAIL_FROM || '"REFERTIMINI" <noreply@refertimini.it>';
  await transporter.sendMail({ from, to, subject, html });
}
