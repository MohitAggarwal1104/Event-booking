import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {

  try {

    console.log("EMAIL USER:", process.env.EMAIL_USER);
    console.log("EMAIL PASS EXISTS:", !!process.env.EMAIL_PASS);

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

    // SEND MAIL
    const info = await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to,

      subject,

      text

    });

    console.log("EMAIL SENT SUCCESS");
    console.log(info);

    return info;

  } catch (err) {

    console.log("FULL EMAIL ERROR:");
    console.log(err);

    throw err;
  }
};
