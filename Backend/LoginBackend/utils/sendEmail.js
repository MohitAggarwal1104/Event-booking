import nodemailer from "nodemailer";

export const sendEmail = async (
  to,
  subject,
  text
) => {

  try {

    const transporter = nodemailer.createTransport({

      host: "smtp-relay.brevo.com",

      port: 587,

      secure: false,

      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY
      },

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000

    });

    console.log("BREVO CONNECTED");

    const info = await transporter.sendMail({

      from: `"EVENT-MANAGEMENT" <ridewithme.hlep@gmail.com>`,

      to,

      subject,

      text

    });

    console.log("EMAIL SENT SUCCESS");

    console.log(info);

    return info;

  } catch (err) {

    console.log("EMAIL ERROR");

    console.log(err);

    throw err;
  }
};
