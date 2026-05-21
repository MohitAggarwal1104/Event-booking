import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {

    console.log("EMAIL USER:", process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },

      tls: {
        rejectUnauthorized: false
      }
    });

    console.log("TRANSPORT CREATED");

    await transporter.verify();

    console.log("SMTP VERIFIED");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log("EMAIL SENT");
    console.log(info);

    return info;

  } catch (err) {

    console.log("FULL EMAIL ERROR:");
    console.log(err);

    throw err;
  }
};
