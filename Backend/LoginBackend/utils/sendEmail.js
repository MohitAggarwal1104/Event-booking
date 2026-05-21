import nodemailer from "nodemailer";

export const sendEmail = async (
  to,
  subject,
  text
) => {

  try {

    console.log("EMAIL START");

    const transporter = nodemailer.createTransport({

      host: "smtp-relay.brevo.com",

      port: 587,

      secure: false,

      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY
      }

    });

    console.log("BREVO CONNECTED");

    const info = await transporter.sendMail({

      from: process.env.BREVO_EMAIL,

      to,

      subject,

      text

    });

    console.log("EMAIL SENT");
    console.log(info);

    return info;

  } catch (err) {

    console.log("EMAIL ERROR");
    console.log(err);

    throw err;
  }
};
