const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, template) => {
  const msg = {
    to: to,
    from: "noman.ghaffar@northbaysolutions.net",
    subject: subject,
    text: "and easy to do anywhere, even with Node.js",
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
