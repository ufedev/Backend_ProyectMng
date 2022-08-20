import nodemailer from "nodemailer"

export const emailConfirmar = async (data) => {
  const { email, nombre, token } = data

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  const info = await transport.sendMail({
    from: '"Up-Task <cuentas@uptask.com>" ',
    to: email,
    subject: "Confirma tu cuenta",
    text: "Confirma tu cuenta y comienza a administrar tus proyectos",
    html: `
            <p>Hola ${nombre} para confirmar tu cuenta haz click en el siguiente enlace </p>
            <p><a href="${process.env.FRONT_URL}/confirmar/${token}">Confirmar cuenta</a></p>
            <p>Si no haz creado esta cuenta ignora este mensaje :) </p>
        `,
  })
}

export const emailRestablecer = async (data) => {
  const { email, nombre, token } = data

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  const info = await transport.sendMail({
    from: '"Up-Task <cuentas@uptask.com>" ',
    to: email,
    subject: "Restablecer Contraseña",
    text: "Restablece tu Contraseña y continua administrando tus proyectos",
    html: `
            <p>Hola ${nombre} para restablecer tu contraseña sigue el siguiente enlace</p>
            <p><a href="${process.env.FRONT_URL}/olvide-password/${token}">Restablecer Contraseña</a></p>
            <p>Si no has sido quien envio el mensaje ignora este correo :) </p>
        `,
  })
}
