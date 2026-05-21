import nodemailer from "nodemailer";

export const sendEmail = async (
  to,
  subject,
  text
) => {

  try {

    const transporter = nodemailer.createTransport({

      host: "smtp.gmail.com",

      port: 465,

      secure: true,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log("TRANSPORT CREATED");

    // VERIFY SMTP
    await transporter.verify();

    console.log("SMTP VERIFIED");

    const info = await transporter.sendMail({
      from: `"EventBook" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log("EMAIL SENT:", info.messageId);

    return info;

  } catch (err) {

    console.log("EMAIL ERROR:", err);

    throw err;
  }
};
