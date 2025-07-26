import db from '../../db.js'
import mail from '../utils/mailer.js';
import 'dotenv/config'
import hash from '../utils/hashing.js';
import { PacientService } from './PacientService.js';

const { sql, poolPromise } = db;
const { sendCodeVerification } = mail;
const { hashingPassword, comparePassword } = hash;
const pacientService = new PacientService();
const UserTable = process.env.DB_USERS_TABLE;

export class AuthService {

    registerUser = async (User) => {
        console.log('This is a function on the service');
        console.log(User)
        const text_exito = "Se ha creado con exito.";

        User.password = await hashingPassword(User.password);
        if (User.password instanceof Error) {
            return new Error('ERROR: No se pudo hashear la contraseña.');
        }

        try {
            const pool = await poolPromise;
            const response = await pool.request()
                .input('Apellido', sql.NVarChar, User?.apellido ?? null)
                .input('Nombre', sql.NVarChar, User?.nombre ?? null)
                .input('Email', sql.NVarChar, User?.email ?? null)
                .input('Telefono', sql.NVarChar, User?.telefono ?? null)
                .input('FechaRegistro', sql.DateTime, new Date().toISOString())
                .input('PasswordHash', sql.NVarChar, User?.password ?? null)
                .input('Rol', sql.NVarChar, User?.rol ?? 'cliente')
                .query(`INSERT INTO ${UserTable}(Apellido, Nombre, Email, Telefono, FechaRegistro, PasswordHash, Rol) VALUES (@Apellido, @Nombre, @Email, @Telefono, @FechaRegistro, @PasswordHash, @Rol)`);
            console.log(response)
            if (response.rowsAffected[0] === 0) {
                return new Error('ERROR: No se pudo crear el usuario.');
            }

            return text_exito;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            return new Error('ERROR: No se pudo crear el usuario.');
        }

    }

    loginUser = async (email, password) => {
        console.log('This is a function on the service');

        try {
            const pool = await poolPromise;
            const response = await pool.request()
                .input('Email', sql.NVarChar, email)
                .query(`SELECT * FROM ${UserTable} WHERE Email = @Email`);

            if (response.recordset.length === 0) {
                return new Error('Usuario no encontrado');
            }

            const user = response.recordset[0];

            const passwordMatch = await comparePassword(password, user.PasswordHash);
            if (passwordMatch instanceof Error || !passwordMatch) {
                return new Error('Contraseña incorrecta');
            }

            return user;
        } catch (error) {
            console.error('Error al hacer login:', error);
            return new Error('ERROR: No se pudo autenticar el usuario.');
        }
    }

    sendMailConfirmation = async (email) => {
        console.log('This is a function on the service');
        const codigoGenerado = Math.floor(100000 + Math.random() * 900000); // Genera un código aleatorio de 6 dígitos  

        try {
            const info = await sendCodeVerification(email, codigoGenerado);
            if (info instanceof Error) {
                console.error('Error al enviar el correo de verificación:', info);
                return new Error('ERROR: No se pudo enviar el correo de verificación.');
            }
            console.log('Correo enviado:', info);

            const user = await pacientService.getPacientByEmail(email);
            if (user instanceof Error) {
                console.error('Error al obtener el usuario:', user);
                return new Error('ERROR: No se pudo obtener el usuario.');
            }
            console.log('Usuario obtenido:', user);

            const response = await pacientService.putFieldPacientById(user.Id, 'CodigoVerificacion', codigoGenerado);
            if (response instanceof Error) {
                console.error('Error al guardar el código de verificación:', response);
                return new Error('ERROR: No se pudo guardar el código de verificación.');
            }
            console.log('Código de verificación guardado en la base de datos.');

            return 'Correo de confirmación enviado.';
        } catch (error) {
            console.error('Error en sendMailConfirmation:', error);
            return new Error('ERROR: No se pudo procesar la confirmación por correo.');
        }
    }

    verifyEmail = async (email, codigo) => {
        console.log('This is a function on the service');

        try {
            const user = await pacientService.getPacientByEmail(email);
            if (user instanceof Error) {
                console.error('Error al obtener el usuario:', user);
                return new Error('ERROR: No se pudo obtener el usuario.');
            }

            if (user.CodigoVerificacion !== codigo) {
                return new Error('ERROR: Código de verificación incorrecto.');
            }

            const response = await pacientService.putFieldPacientById(user.Id, 'EmailVerificado', true);
            if (response instanceof Error) {
                console.error('Error al verificar el email:', response);
                return new Error('ERROR: No se pudo verificar el email.');
            }

            return 'Email verificado con éxito.';
        } catch (error) {
            console.error('Error en verifyEmail:', error);
            return new Error('ERROR: No se pudo procesar la verificación del email.');
        }
    }
}