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
      const result = await pool.request()
        .query(`select Specie_Id, Specie_Name from ${SpecieTable}
                        order by Specie_Id`);
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
                    s.Service_Id AS IdServicio,
                    s.Service_Name AS NombreServicio,
                    s.Service_Description AS Descripcion,
                    s.Service_MinutesDuration AS DuracionMinutos,
                    s.Service_Price AS Precio,
                    c.Field_Id AS IdCampo,
                    c.Field_Description AS NombreCampo,
                    c.Field_Type AS TipoCampo,
                    c.Field_IsRequired AS EsRequerido,
                    os.OptionsSelect_Id AS IdOpcion,
                    os.OptionsSelect_Value AS ValorOpcion
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
        if (!servicios[row.IdServicio]) {
          servicios[row.IdServicio] = {
            IdServicio: row.IdServicio,
            Nombre: row.NombreServicio,
            Descripcion: row.Descripcion,
            DuracionMinutos: row.DuracionMinutos,
            Precio: row.Precio,
            Campos: {}, // Usamos un objeto para evitar campos duplicados
          };
        }

        // Agrupa los campos dentro de cada servicio
        if (!servicios[row.IdServicio].Campos[row.IdCampo]) {
          servicios[row.IdServicio].Campos[row.IdCampo] = {
            IdCampo: row.IdCampo,
            NombreCampo: row.NombreCampo,
            TipoCampo: row.TipoCampo,
            EsRequerido: row.EsRequerido,
            Opciones: [], // Array para las opciones del campo
          };
        }

        // Agrega las opciones al campo correspondiente si existen
        if (row.IdOpcion) {
          servicios[row.IdServicio].Campos[row.IdCampo].Opciones.push({
            IdOpcion: row.IdOpcion,
            ValorOpcion: row.ValorOpcion,
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
      return new Error("Error buscando servicios de especie");
    }
  };
}
