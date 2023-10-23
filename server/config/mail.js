const nodemailer = require("nodemailer")

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5d06ec2464c1ed",
      pass: "f4396162c018aa"
    }
});

module.exports = transport