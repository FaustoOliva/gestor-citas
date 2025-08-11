import db from '../../db.js'
import 'dotenv/config'
import User from '../models/UserModel.js';

const { sql, poolPromise } = db;
const pacientTable = process.env.DB_USERS_TABLE;


export class PacientService {

    // createPacient = async (Pacient) => {
    //     console.log('This is a function on the service');
    //     console.log(Pacient)
    //     const text_exito = "Se ha creado con exito.";


    //     const pool = await sql.connect(config);
    //     const response = await pool.request()
    //         .input('Apellido', sql.NVarChar, Pacient?.apellido ?? null)
    //         .input('Nombre', sql.NVarChar, Pacient?.nombre ?? null)
    //         .input('Email', sql.NVarChar, Pacient?.email ?? null)
    //         .input('Telefono', sql.NVarChar, Pacient?.telefono ?? null)
    //         .input('FechaRegistro', sql.DateTime, new Date().toISOString())
    //         .input('PasswordHash', sql.NVarChar, Pacient?.password ?? null)
    //         .input('Rol', sql.NVarChar, Pacient?.rol ?? 'cliente')
    //         .query(`INSERT INTO ${pacientTable}(Apellido, Nombre, Email, Telefono, FechaRegistro, PasswordHash, Rol) VALUES (@Apellido, @Nombre, @Email, @Telefono, @FechaRegistro, @PasswordHash, @Rol)`);
    //     console.log(response)

    //     return text_exito;
    // }

    deletePacientById = async (id) => {
        console.log('This is a function on the service');
        const text_exito = "Se ha borrado con exito."

        try {
            const pool = await poolPromise;
            const response = await pool.request()
                .input('Id', sql.Int, id)
                .query(`DELETE FROM ${pacientTable} WHERE Id = @Id`);
            console.log(response)

            if (response.rowsAffected[0] === 0) {
                return new Error('ERROR: No se pudo eliminar el paciente.');
            }
            return text_exito;
        } catch (error) {
            console.error('Error al eliminar el paciente:', error);
            return new Error('ERROR: No se pudo eliminar el paciente.');
        }
    }

    getPacientById = async (id) => {
        console.log('This is a function on the service');

        let paciente;

        try {
            const pool = await poolPromise;
            paciente = await pool.request()
                .input('Id', sql.Int, id)
                .query(`SELECT * FROM ${pacientTable} WHERE Id = @Id`);

            if (paciente.recordset.length === 0) {
                return new Error('Paciente no encontrado');
            }

            return paciente.recordset[0];
        } catch (error) {
            console.error('Error al obtener el paciente por ID:', error);
            return new Error('ERROR: No se pudo obtener el paciente por ID.');
        }

    }

    getPacientByEmail = async (email) => {
        console.log('This is a function on the service');
        let paciente;

        try {
            const pool = await poolPromise;
            paciente = await pool.request()
                .input('Email', sql.NVarChar, email)
                .query(`SELECT * FROM ${pacientTable} WHERE Email = @Email`);

            if (paciente.recordset.length === 0) {
                return new Error('Paciente no encontrado');
            }

            return paciente.recordset[0];
        } catch (error) {
            console.error('Error al obtener el paciente por email:', error);
            return new Error('ERROR: No se pudo obtener el paciente por email.');

        }
    }

    putFieldPacientById = async (id, field, value) => {
        console.log('This is a function on the service');
        console.log(id, field, value)
        const fieldInfo = new User().fields[field];
        if (!fieldInfo) {
            return new Error(`ERROR: El campo ${field} no es válido.`);
        }
        const text_exito = "Se ha actualizado con exito.";
        console.log(typeof(value))
        try {
            const pool = await poolPromise;
            const response = await pool.request()
                .input('Id', sql.Int, id ?? '')
                .input(field, sql.NVarChar, String(value) ?? '')
                .query(`UPDATE ${pacientTable} SET ${field} = @${field} WHERE Id = @Id`);
            console.log(response)
            if (response.rowsAffected[0] === 0) {
                return new Error(`ERROR: No se pudo actualizar el campo ${field} del paciente.`);
            }
            return text_exito;
        } catch (error) {
            console.error('Error al actualizar el campo del paciente:', error);
            return new Error('ERROR: No se pudo actualizar el campo del paciente.');

        }
    }

    getAllPacients = async () => {
        console.log('This is a function on the service');
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`SELECT Id, Nombre, Apellido, Email, Telefono FROM ${pacientTable} WHERE EmailVerificado = 1`);
            if (result.recordset.length === 0) {
                return new Error('No se encontraron pacientes');
            }
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener todos los pacientes:', error);
            return new Error('ERROR: No se pudo obtener la lista de pacientes.');
        }
    }
}