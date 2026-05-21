import axios from "axios";

export const sendEmail = async (
  to,
  subject,
  text
) => {

  try {

    const response = await axios.post(

      "https://api.brevo.com/v3/smtp/email",

      {
        sender: {
          name: "EVENT-MANAGEMENT",
          email: "ridewithme.hlep@gmail.com"
        },

        to: [
          {
            email: to
          }
        ],

        subject,

        textContent: text
      },

      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json"
        }
      }
    );

    console.log("EMAIL SENT SUCCESS");

    return response.data;

  } catch (err) {

    console.log("BREVO API ERROR");

    console.log(
      err.response?.data || err.message
    );

    throw err;
  }
};
