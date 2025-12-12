import { createGmailTransporter, sendMail } from "./transporter.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadTemplate(name) {
  const fullPath = path.join(__dirname, "templates", name);
  return fs.readFileSync(fullPath, "utf-8");
}

const verificationTemplate = loadTemplate("verification.html");
const resetTemplate = loadTemplate("reset.html");
const deletionTemplate = loadTemplate("deletion.html");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;
const from = `CRUD API <${EMAIL_USER}>`;

let transporter;
try {
  transporter = createGmailTransporter(EMAIL_USER, EMAIL_APP_PASSWORD);
} catch (err) {
  console.error("Error in configuration of the transporter:", err.message);
  process.exit(1);
}

export const sendVerificationEmail = async (to) => {
  const message = {
    from,
    to,
    subject: "Verification Email",
    html: verificationTemplate,
  };

  return await sendMail(transporter, message);
};

export const sendResetPasswordEmail = async (to, code) => {
  const html = resetTemplate.replace("XXX-XXX", code);

  const message = {
    from,
    to,
    subject: "Verification Email",
    html,
  };

  return await sendMail(transporter, message);
};

export const sendDeletionEmail = async (to) => {
  const message = {
    from,
    to,
    subject: "Account Deleted",
    html: deletionTemplate,
  };

  return await sendMail(transporter, message);
};

export const sendErrorEmail = async (errorMessage) => {
  const message = {
    from,
    to: EMAIL_USER, // or another admin email
    subject: "CRUD API Error Notification",
    text: `An error occurred:\n\n${errorMessage}`,
  };

  return await sendMail(transporter, message);
};
