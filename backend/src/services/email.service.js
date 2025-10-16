const fs = require("fs");
const ejs = require("ejs");
const juice = require("juice");
const nodemailer = require("nodemailer");
const config = require("../config/config");

const transport = nodemailer.createTransport({
  ...config.email.smtp,
  secure: config.email.smtp.port === 465,
});
transport
  .verify()
  .then(() => console.log("Connected to email service"))
  .catch(() => console.log("Unable to connect to email service. Make sure you have configured the SMTP options in .env"));
const sendEmail = async (to, subject, html) => {
  const msg = {
    from: config.email.smtp.auth.user,
    to,
    subject,
    html,
  };
  await transport.sendMail(
    msg
    /* 
   msg, (err) => {
    
    if (err) {
      return res.json({
        message: "Error",
        err,
      });
    }
    return res.json({
      message: `Sent successfully to ${msg.to}`,
    });
  } */
  );
};
const sendEjsMail = async ({ template: templateName, templateVars, ...restOfOptions }) => {
  const templatePath = `src/templates/${templateName}.html`;
  const options = {
    from: config.email.smtp.auth.user,
    ...restOfOptions,
  };

  if (templateName && fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, "utf-8");
    let html;
    if (templateVars) html = await ejs.render(template, templateVars);
    else html = await ejs.render(template);
    const htmlWithStylesInlined = juice(html);

    options.html = htmlWithStylesInlined;
  }
  return transport.sendMail(options);
};

module.exports = {
  transport,
  sendEmail,
  sendEjsMail,
};
