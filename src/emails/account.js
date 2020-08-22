const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "pretoriasmith@gmail.com",
    subject: "Thanks for using the Task App!",
    text: `Hello ${name}! Let me know if you like the app.`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "pretoriasmith@gmail.com",
    subject: "We are sorry to see you go",
    text: `Hello ${name}! We are sorry to see you go.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
