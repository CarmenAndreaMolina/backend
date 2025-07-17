const nodemailer = require('nodemailer');
const path = require('path');

async function enviarCorreoConAdjunto({ destinatario, asunto, texto, rutaAdjunto, nombreAdjunto }) {
  // Configura tu transportador SMTP (ejemplo con Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // tu email
      pass: process.env.EMAIL_PASS, // tu contraseña o app password
    },
  });

  // Opciones del correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    text: texto,
    attachments: [
      {
        filename: nombreAdjunto,
        path: rutaAdjunto,
      },
    ],
  };

  // Enviar el correo
  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = enviarCorreoConAdjunto;
