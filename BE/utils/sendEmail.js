const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, template) => {
  const msg = {
    to: to,
    from: "nomanbinadam@gmail.com",
    subject: subject,
    text: "Enter this OTP to verify",
    html: template,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
module.exports = sendEmail;
