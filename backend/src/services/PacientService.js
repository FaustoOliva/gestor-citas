import sql from 'mssql'
import config from '../../db.js'
import 'dotenv/config'

const pacientTable = process.env.DB_USERS_TABLE;
//Revisado

export class PacientService {

    createPacient = async (Pacient) => {
        console.log('This is a function on the service');
        console.log(Pacient)
        const text_exito = "Se ha creado con exito.";

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

    deletePacientById = async (id) => {
        console.log('This is a function on the service');
        const text_exito = "Se ha borrado con exito."

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('Id', sql.Int, id)
            .query(`DELETE FROM ${pacientTable} WHERE Id = @Id`);
        console.log(response)

        return text_exito;
    }

    getPacientById = async (id) => {
        console.log('This is a function on the service');

        let paciente;

        const pool = await sql.connect(config);
        paciente = await pool.request()
            .input('Id', sql.Int, id)
            .query(`Select * FROM ${pacientTable} where Id = @Id`);
        console.log(paciente)

        return paciente.recordset;
    }

    getPacientByEmail = async (email) => {
        console.log('This is a function on the service');

        let paciente;

        const pool = await sql.connect(config);
        paciente = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query(`Select * FROM ${pacientTable} where Email = @Email`);
        console.log(paciente)

        return paciente.recordset;
    }
}

export class PersonajeService {
     updatePersonajeById = async (id, personaje) => {
        console.log('This is a function on the service');
        console.log(id, personaje)
        const text_exito = "Se ha actualizado con exito."

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('id', sql.Int, id ?? '')
            .input('Imagen', sql.VarChar, personaje?.imagen ?? '')
            .input('Nombre', sql.VarChar, personaje?.nombre ?? '')
            .input('Edad', sql.VarChar, personaje?.edad ?? '')
            .input('Peso', sql.VarChar, personaje?.peso ?? '')
            .input('Historia', sql.VarChar, personaje?.historia ?? '')
            .query(`UPDATE ${personajeTabla} SET Imagen = @Imagen, Nombre = @Nombre, Edad = @Edad, Peso = @Peso, Historia = @Historia WHERE id = @id`);
        console.log(response)

        return text_exito;
    }

    deletePersonajeById = async (id) => {
        console.log('This is a function on the service');
        const text_exito = "Se ha borrado con exito."

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('id', sql.Int, id)
            .query(`DELETE FROM ${personajeTabla} WHERE id = @id`);
        console.log(response)

        return text_exito;
    }

    getDetallesPersonaje = async (id) => {
        console.log('This is a function on the service');

        let personaje;
        let serie;

        const pool = await sql.connect(config);
        personaje = await pool.request()
            .input('id', sql.Int, id)
            .query(`Select * FROM ${personajeTabla} where id = @id`);
        console.log(personaje)

        serie = await pool.request()
            .input('id', sql.Int, id)
            .query(`select s.id, s.imagen, s.titulo, s.fechaDeCreacion, s.calificacion from ${serieTabla} s inner join ${intermedia} on s.id = ${intermedia}.idS inner join ${personajeTabla} on ${personajeTabla}.id = ${intermedia}.idP AND ${personajeTabla}.id = @id`);
        console.log(serie)

        personaje.recordset[0].seriesAsociadas = serie.recordset;

        return personaje.recordset;

    }

      getPersonajeFiltrado = async (nombre, edad, peso, serie) => {
        console.log('This is a function on the service');
        console.log(nombre)
        let query = `SELECT p.id, p.Imagen, p.Nombre FROM ${personajeTabla} p, ${intermedia} WHERE p.id = ${intermedia}.idP `
        
        let response;
        if (nombre) {
            query += ` AND p.Nombre = @nombre`;
        } if (edad) {
            query += ` AND p.Edad = @edad`;
        } if (peso) {
            query += ` AND p.Peso = @peso`;
        } if (serie) {
            query += ` AND ${intermedia}.idS = @serie`;
        }
        console.log(query)
        const pool = await sql.connect(config);
        response = await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('edad', sql.VarChar, edad)
            .input('peso', sql.VarChar, peso)
            .input('serie', sql.Int, serie)
            .query(query);
            console.log(query)
        console.log(response)

        if (response.recordset.length==0){
            let text='No hay ningun personaje que coincida con la busqueda'
            return text;
        }else{
            return response.recordset;

        }

    }

    getListPersonaje = async () => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .query(`SELECT imagen,nombre,id from ${personajeTabla} `);
        console.log(response)

        return response.recordset;
    }
}