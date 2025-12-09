const nodemailer = require("nodemailer");
const ejs = require("ejs");
const juice = require("juice");
const path = require("path");
const { ApiError } = require("../utils");
const config = require("../config/config");

const sendEmail = async (to, subject, templateName, data) => {
  try {
    const templatePath = path.join(__dirname, "../views/emails", `${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, data);
    const inlinedHTML = juice(html);

    const transporter = nodemailer.createTransport({
      service: config.email.smtp.service,
      port: config.email.smtp.port,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass,
      },
    });

    const mailOptions = {
      from: config.email.smtp.auth.user,
      to,
      subject,
      html: inlinedHTML,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(500, `Email sending failed: ${error.message}`);
  }
};

// Alias method for compatibility with existing code
const sendEjsMail = async ({ to, subject, template, templateVars }) => {
  try {
    const templatePath = path.join(__dirname, "../templates", `${template}.ejs`);
    const html = await ejs.renderFile(templatePath, templateVars);
    const inlinedHTML = juice(html);

    const transporter = nodemailer.createTransport({
      service: config.email.smtp.service,
      port: config.email.smtp.port,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass,
      },
    });

    const mailOptions = {
      from: config.email.smtp.auth.user,
      to,
      subject,
      html: inlinedHTML,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(500, `Email sending failed: ${error.message}`);
  }
};

module.exports = { sendEmail, sendEjsMail };
