import sql from 'mssql'
import config from '../../db.js'
import 'dotenv/config'
import { hashingPassword, comparePassword } from '../utils/hashing.js';

const pacientTable = process.env.DB_USERS_TABLE;

export class AuthService {

    registerPacient = async (Pacient) => {
        console.log('This is a function on the service');
        console.log(Pacient)
        const text_exito = "Se ha creado con exito.";

        // Hash the password before storing it
        Pacient.password = await hashingPassword(Pacient.password);
        if (Pacient.password instanceof Error) {
            return new Error('ERROR: No se pudo hashear la contraseña.');
        }

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('Apellido', sql.NVarChar, Pacient?.apellido ?? null)
            .input('Nombre', sql.NVarChar, Pacient?.nombre ?? null)
            .input('Email', sql.NVarChar, Pacient?.email ?? null)
            .input('Telefono', sql.NVarChar, Pacient?.telefono ?? null)
            .input('FechaRegistro', sql.DateTime, new Date().toISOString())
            .input('PasswordHash', sql.NVarChar, Pacient?.password ?? null)
            .input('Rol', sql.NVarChar, Pacient?.rol ?? 'cliente')
            .query(`INSERT INTO ${pacientTable}(Apellido, Nombre, Email, Telefono, FechaRegistro, PasswordHash, Rol) VALUES (@Apellido, @Nombre, @Email, @Telefono, @FechaRegistro, @PasswordHash, @Rol)`);
        console.log(response)

        return text_exito;
    }

    loginPacient = async (email, password) => {
        console.log('This is a function on the service');
        
        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query(`SELECT * FROM ${pacientTable} WHERE Email = @Email`);
        
        if (response.recordset.length === 0) {
            return new Error('Usuario no encontrado');
        }

        const user = response.recordset[0];
        // Aquí se debería verificar el password con bcrypt o similar
        if(comparePassword(password, user.PasswordHash) instanceof Error) {
            return new Error('Contraseña incorrecta');
        }    

        return user;
    }

}