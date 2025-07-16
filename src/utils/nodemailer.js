const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.nodemailerEmailAccount,
    pass: process.env.nodemailerPasswordAccount,
  },
});

module.exports = {
  sendEmail: async (user, subject, text) => {
    const mailToSend = {
      from: process.env.nodemailerEmailAccount,
      to: user.email,
      subject,
      html: text,
    };

    try {
      await transporter.sendMail(mailToSend);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
