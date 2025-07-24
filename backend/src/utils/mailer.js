import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

async function enviarCodigo(email, codigo) {
    await transporter.sendMail({
        from: `"Veterinaria" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Código de verificación',
        text: `Tu código de verificación es: ${codigo}`
    });
}

module.exports = { enviarCodigo };
