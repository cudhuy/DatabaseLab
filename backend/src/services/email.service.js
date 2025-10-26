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
      service: "gmail",
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });

    const mailOptions = {
      from: config.email.user,
      to,
      subject,
      html: inlinedHTML,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(500, `Email sending failed: ${error.message}`);
  }
};

module.exports = { sendEmail };
