import db from "../../db.js";
import "dotenv/config";
const { sql, poolPromise } = db;

const SpecieTable = process.env.DB_SPECIE_TABLE;
const ServiceTable = process.env.DB_SERVICE_TABLE;
const FieldTable = process.env.DB_FIELD_TABLE;
const FieldsOptionTable = process.env.DB_FIELDS_OPTION_TABLE;
const ServiceFieldTable = process.env.DB_SERVICE_FIELD_TABLE;
const SpecieServiceTable = process.env.DB_SPECIE_SERVICE_TABLE;

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
            IdServicio: row.id,
            Nombre: row.name,
            Descripcion: row.description,
            DuracionMinutos: row.duration,
            Precio: row.price,
            Campos: {}, // Usamos un objeto para evitar campos duplicados
          };
        }

        // Agrupa los campos dentro de cada servicio
        if (!servicios[row.id].Campos[row.fieldId]) {
          servicios[row.id].Campos[row.fieldId] = {
            IdCampo: row.fieldId,
            NombreCampo: row.fieldName,
            TipoCampo: row.fieldType,
            EsRequerido: row.IsRequired,
            Opciones: [], // Array para las opciones del campo
          };
        }

        // Agrega las opciones al campo correspondiente si existen
        if (row.optionId) {
          servicios[row.id].Campos[row.fieldId].Opciones.push({
            IdOpcion: row.optionId,
            ValorOpcion: row.optionValue,
          });
        }
      });

      // Convierte el objeto anidado en un array para el resultado final
      const resultadoFinal = Object.values(servicios).map((servicio) => {
        servicio.Campos = Object.values(servicio.Campos);
        return servicio;
      });

      return resultadoFinal;
    } catch (error) {
      console.error("Error buscando servicios de especie:", error);
      throw new Error("Error buscando servicios de especie");
    }
  };
}
