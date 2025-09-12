import db from "../../db.js";
import "dotenv/config";
const { sql, poolPromise } = db;

const SpecieTable = process.env.DB_SPECIE_TABLE;
const ServiceTable = process.env.DB_SERVICE_TABLE;
const FieldTable = process.env.DB_FIELD_TABLE;
const FieldsOptionTable = process.env.DB_FIELDS_OPTION_TABLE;
const ServiceFieldTable = process.env.DB_SERVICE_FIELD_TABLE;
const SpecieServiceTable = process.env.DB_SPECIE_SERVICE_TABLE;
const PetTable = process.env.DB_PET_TABLE;
const AppointmentTable = process.env.DB_APPOINTMENT_TABLE;
const StatusTable = process.env.DB_STATUS_TABLE;
const UserTable = process.env.DB_USER_TABLE;

export class FrontService {
  getSpecies = async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
          SELECT 
            Specie_Id AS id, 
            Specie_Name AS name 
          FROM ${SpecieTable} 
          ORDER BY Specie_Id`);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset;
    } catch (error) {
      console.error("Error buscando especies:", error);
      return new Error("Error buscando especies");
    }
  };

  getServices = async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
          SELECT 
            Service_Id AS id, 
            Service_Name AS name 
          FROM ${ServiceTable} 
          ORDER BY Service_Id`);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset;
    } catch (error) {
      console.error("Error buscando servicios:", error);
      return new Error("Error buscando servicios");
    }
  };

  getServicesBySpecie = async (specieId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().input("Id", sql.Int, specieId).query(`
        SELECT
          s.Service_Id AS id,
          s.Service_Name AS name,
          s.Service_Description AS description,
          s.Service_MinutesDuration AS duration,
          s.Service_Price AS price,
          c.Field_Id AS fieldId,
          c.Field_Description AS fieldName,
          c.Field_Type AS fieldType,
          c.Field_IsRequired AS IsRequired,
          os.OptionsSelect_Id AS optionId,
          os.OptionsSelect_Value AS optionValue
        FROM ${ServiceTable} s
        JOIN ${SpecieServiceTable} ss ON s.Service_Id = ss.ServiceId
        JOIN ${ServiceFieldTable} sc ON s.Service_Id = sc.ServiceId
        JOIN ${FieldTable} c ON sc.FieldId = c.Field_Id
        LEFT JOIN ${FieldsOptionTable} os ON c.Field_Id = os.OptionsSelect_FieldId
        WHERE ss.SpecieId = @Id AND s.Service_IsVisibleToUser = 1
        ORDER BY s.Service_Id, c.Field_Id;
      `);

      if (result.recordset.length === 0) {
        return []; // Retorna un array vacío en lugar de un error si no hay servicios
      }

      const servicios = {};
      result.recordset.forEach((row) => {
        if (!servicios[row.id]) {
          servicios[row.id] = {
            id: row.id,
            name: row.name,
            description: row.description,
            durationMinutes: row.duration,
            price: row.price,
            fields: {}, // Usamos un objeto para evitar campos duplicados
          };
        }

        // Agrupa los campos dentro de cada servicio
        if (!servicios[row.id].fields[row.fieldId]) {
          servicios[row.id].fields[row.fieldId] = {
            id: row.fieldId,
            name: row.fieldName,
            type: row.fieldType,
            isRequired: row.IsRequired,
            options: [], // Array para las opciones del campo
          };
        }

        // Agrega las opciones al campo correspondiente si existen
        if (row.optionId) {
          servicios[row.id].fields[row.fieldId].options.push({
            id: row.optionId,
            value: row.optionValue,
          });
        }
      });

      // Convierte el objeto anidado en un array para el resultado final
      const resultadoFinal = Object.values(servicios).map((servicio) => {
        servicio.fields = Object.values(servicio.fields);
        return servicio;
      });

      return resultadoFinal;
    } catch (error) {
      console.error("Error buscando servicios de especie:", error);
      throw new Error("Error buscando servicios de especie");
    }
  };

  getDashboardStats = async () => {
    try {
      const pool = await poolPromise;

      const totalUsers = await pool.request().query(
        `SELECT COUNT(*) AS totalUsers FROM ${UserTable}
        WHERE User_IsEmailVerified = 1 AND User_IsAdmin = 0`
      );

      const totalPetsBySpecie = await pool.request().query(
        `SELECT Sp.Specie_Name AS Specie, COUNT(P.Pet_Id) AS Total
        FROM ${SpecieTable} Sp 
        LEFT JOIN ${PetTable} P ON P.Pet_SpecieId = Sp.Specie_Id
        GROUP BY Sp.Specie_Name
        ORDER BY Total DESC;`
      );

      const totalAppointmentsByStatus = await pool.request().query(
        `SELECT S.Status_Description AS Status, COUNT(A.Appointment_Id) AS Total
        FROM ${AppointmentTable} A
        JOIN ${StatusTable} S ON A.Appointment_StatusId = S.Status_Id
        GROUP BY S.Status_Description, S.Status_Id
        ORDER BY S.Status_Id;`
      );

      const totalAppointmentsByService = await pool.request().query(
        `SELECT S.Service_Name AS Service, COUNT(A.Appointment_Id) AS Total
          FROM ${AppointmentTable} A
          JOIN ${ServiceTable} S ON A.Appointment_ServiceId = S.Service_Id
          GROUP BY S.Service_Name
          ORDER BY Total DESC;`
      );

      return {
        totalUsers: totalUsers.recordset[0].totalUsers,
        totalPetsBySpecie: totalPetsBySpecie.recordset,
        totalAppointmentsByStatus: totalAppointmentsByStatus.recordset,
        totalAppointmentsByService: totalAppointmentsByService.recordset,
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas del dashboard:", error);
      throw new Error("Error obteniendo estadísticas del dashboard");
    }
  };
}
