import db from "../../db.js";
import 'dotenv/config'

const { sql, poolPromise } = db;
const AppointmentTable = process.env.DB_APPOINTMENTS_TABLE;
const SpeciesTable = process.env.DB_SPECIES_TABLE;
const ServicesTable = process.env.DB_SERVICES_TABLE;
const ServiceFieldsTable = process.env.DB_SERVICE_FIELDS_TABLE;
const FieldsTable = process.env.DB_FIELDS_TABLE;
const FieldsOptionsTable = process.env.DB_FIELDS_OPTIONS_TABLE;
const UsersTable = process.env.DB_USERS_TABLE;

export class AppointmentService {

    createAppointment = async (userId, speciesId, serviceId, fields) => {
        console.log('Creating appointment...', fields);
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input("IdUsuario", sql.Int, userId)
                .input("IdEspecie", sql.Int, speciesId)
                .input("IdServicio", sql.Int, serviceId)
                .input("Campos", sql.NVarChar, JSON.stringify(fields))
                .query(`INSERT INTO ${AppointmentTable} (IdUsuario, IdEspecie, IdServicio, Estado, Campos) VALUES (@IdUsuario, @IdEspecie, @IdServicio, 'Pendiente', @Campos)`);
            if (result.rowsAffected[0] === 0) {
                return new Error("Error creating appointment");
            }
            return true;
        } catch (error) {
            console.error("Error creating appointment:", error);
            return new Error("Error creating appointment");
        }
    }

    getAppointmentsByUserId = async (userId) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input("IdUsuario", sql.Int, userId)
                .query(`
                    Select c.IdCita IdCita, s.Nombre NombreServicio, e.Nombre NombreEspecie, 
                    s.Descripcion Descripcion, s.Precio Precio, s.DuracionMinutos Duracion
                    from ${AppointmentTable} c
                    JOIN ${ServicesTable} s ON c.IdServicio = s.IdServicio
                    JOIN ${SpeciesTable} e ON e.IdEspecie = c.IdEspecie
                    where IdUsuario = @IdUsuario`
                );
            if (result.recordset.length === 0) {
                return new Error("No appointments found for this user");
            }
            return result.recordset;
        } catch (error) {
            console.error("Error fetching appointments by user ID:", error);
            return new Error("Error fetching appointments by user ID");
        }
    }

    getAllAppointments = async () => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`
                    SELECT c.IdCita, u.Nombre NombreUsuario, e.Nombre NombreEspecie, 
                    s.Nombre NombreServicio, c.Estado EstadoCita, c.Campos, 
                    s.IdServicio, u.Id IdUsuario
                    FROM ${AppointmentTable} c
                    JOIN ${ServicesTable} s ON c.IdServicio = s.IdServicio
                    JOIN ${SpeciesTable} e ON e.IdEspecie = c.IdEspecie
                    JOIN ${UsersTable} u ON u.Id = c.IdUsuario
                `);
            if (result.recordset.length === 0) {
                return new Error("No appointments found");
            }
            return result.recordset;
        } catch (error) {
            console.error("Error fetching all appointments:", error);
            return new Error("Error fetching all appointments");
        }
    }

}