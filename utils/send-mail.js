const nodemailer = require('nodemailer');

function sendMail(mailOptions) {
  const transporter = nodemailer.createTransport({
    // Configura el transporte de correo electrónico aquí
    service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSMAIL,
        },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = sendMail;
