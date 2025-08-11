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

    getSpecies = async () => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`SELECT * FROM ${SpeciesTable}`);
            if (result.recordset.length === 0) {
                return new Error("No species found");
            }
            return result.recordset;
        } catch (error) {
            console.error("Error fetching species:", error);
            return new Error("Error fetching species");
        }
    }

    getServicesBySpecie = async (specie) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input("Id", sql.VarChar, specie)
                .query(`
                SELECT 
                s.IdServicio,
                s.Nombre AS NombreServicio,
                s.Descripcion,
                s.DuracionMinutos,
                s.Precio,
                c.IdCampo,
                c.Nombre AS NombreCampo,
                c.TipoDato,
                c.EsRequerido,
                co.IdOpcion,
                co.Valor AS ValorOpcion
            FROM ${ServicesTable} s
            JOIN ${ServiceFieldsTable} sc ON s.IdServicio = sc.IdServicio
            JOIN ${FieldsTable} c ON sc.IdCampo = c.IdCampo
            LEFT JOIN ${FieldsOptionsTable} co ON c.IdCampo = co.IdCampo
            WHERE s.IdEspecie = @Id
            ORDER BY s.Nombre, c.Nombre;
            `);
            if (result.recordset.length === 0) {
                return new Error("No services found for this species");
            }
            const servicios = {};
            result.recordset.forEach(row => {
                if (!servicios[row.IdServicio]) {
                    servicios[row.IdServicio] = {
                        IdServicio: row.IdServicio,
                        Nombre: row.NombreServicio,
                        Descripcion: row.Descripcion,
                        DuracionMinutos: row.DuracionMinutos,
                        Precio: row.Precio,
                        Campos: []
                    };
                }
                servicios[row.IdServicio].Campos.push({
                    IdCampo: row.IdCampo,
                    NombreCampo: row.NombreCampo,
                    TipoCampo: row.TipoDato,
                    EsRequerido: row.EsRequerido,
                    ValorOpcion: row.ValorOpcion
                });
            });
            return Object.values(servicios);
        } catch (error) {
            console.error("Error fetching services by specie:", error);
            return new Error("Error fetching services by specie");
        }
    }

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