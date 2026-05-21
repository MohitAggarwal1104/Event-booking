import nodemailer from "nodemailer";

export const sendEmail = async (
  to,
  subject,
  text
) => {

  try {

    console.log("EMAIL USER:", process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log("TRANSPORT CREATED");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log("EMAIL SENT:", info.response);

  } catch (err) {

    console.log("EMAIL ERROR:", err);

    throw err;
  }
};
