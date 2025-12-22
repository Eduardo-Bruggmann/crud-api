import nodemailer from "nodemailer";

export const createGmailTransporter = (email, appPassword) => {
  if (!email || !appPassword) {
    throw new Error(
      "Email and appPassword are required to create the transporter."
    );
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 465,
    secure: true,
    auth: {
      user: email,
      pass: appPassword,
    },
  });
};

export const sendMail = async (transporter, message) => {
  if (!transporter) throw new Error("transporter not provided");
  if (!message?.to || !message?.subject || (!message?.text && !message?.html)) {
    throw new Error("message must include to, subject, and text or html");
  }

  try {
    const info = await transporter.sendMail(message);
    return {
      ok: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message || err.toString(),
      fullError: err,
    };
  }
};
