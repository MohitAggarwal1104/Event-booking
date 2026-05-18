import nodemailer from "nodemailer";

// create transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔥 GENERAL EMAIL
export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
  } catch (err) {
    console.log("Email error:", err);
  }
};

// 🔥 SEND TICKET WITH QR
export const sendTicketEmail = async (to, eventName, qrCode) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "🎟 Your Event Ticket",
      html: `
        <div style="font-family: Arial; text-align: center;">
          <h2>${eventName}</h2>
          <p>Your booking is confirmed 🎉</p>
          <p>Show this QR at entry:</p>

          <img src="${qrCode}" style="width:200px; margin:20px 0;" />

          <p>Thank you for booking with us 🙌</p>
        </div>
      `
    });

  } catch (err) {
    console.log("Ticket email error:", err);
  }
};