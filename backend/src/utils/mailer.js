import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false,
    },
    logger: true // Habilitar registro
});

async function sendCodeVerification(email, codigo) {
    try {
        const info = await transporter.sendMail({
            from: `"Vet Citas" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Código de verificación',
            text: `Tu código de verificación es: ${codigo}`
        });
        return info;
    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        throw new Error('ERROR: No se pudo enviar el correo de verificación.');

    }

}

export default {
    sendCodeVerification
};
