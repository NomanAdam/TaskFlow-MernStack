// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendEmail = async (to, subject, template) => {
//   const msg = {
//     to: to,
//     from: "nomanbinadam@gmail.com",
//     subject: subject,
//     text: "Enter this OTP to verify",
//     html: template,
//   };
//   try {
//     await sgMail.send(msg);
//   } catch (error) {
//     console.error(error);

//     if (error.response) {
//       console.error(error.response.body);
//     }
//   }
// };
// module.exports = sendEmail;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_PASSWORD,
  },
});

const sendEmail = async (to, subject, template) => {
  const msg = {
    from: "nomanbinadam@gmail.com",
    to: to,
    subject: subject,
    text: "Enter this OTP to verify",
    html: template,
  };
  try {
    await transporter.sendMail(msg);
  } catch (error) {
    console.error("Email send error:", error.message);
  }
};

module.exports = sendEmail;
