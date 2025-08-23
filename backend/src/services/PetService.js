import db from '../../db.js'
import 'dotenv/config'
const { sql, poolPromise } = db;

const PetTable = process.env.DB_PET_TABLE;
const SpecieTable = process.env.DB_SPECIE_TABLE;
const UserTable = process.env.DB_USER_TABLE;

export class PetService {

    getPetsByUserId = async (userId) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input("IdUsuario", sql.Int, userId)
                .query(`
                    SELECT Pet_Id, Pet_Name, Pet_Race, Specie_Name
                    FROM ${PetTable}
                    join ${SpecieTable} on Specie_Id = Pet_SpecieId
                    join ${UserTable} on User_Id = Pet_UserId and User_Id = @IdUsuario
                    WHERE Pet_IsDeleted = 0
                `);
            if (result.recordset.length === 0) {
                return new Error("No pets found for this user");
            }
            return result.recordset;
        } catch (error) {
            console.error("Error fetching pets by user ID:", error);
            return new Error("Error fetching pets by user ID");
        }
    }

    getPetById = async (petId) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input("PetId", sql.Int, petId)
                .query(`
                    SELECT Pet_Id, Pet_Name, Pet_Race, Pet_BirthDate, Pet_Size, Pet_Weight, Specie_Name
                    FROM ${PetTable} 
                    join ${SpecieTable} on Specie_Id = Pet_SpecieId
                    WHERE Pet_Id = @PetId and Pet_IsDeleted = 0
                `);
            if (result.recordset.length === 0) {
                return new Error("Pet not found");
            }
            return result.recordset[0];
        } catch (error) {
            console.error("Error fetching pet by ID:", error);
            return new Error("Error fetching pet by ID");
        }
    }

    getPets = async () => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`
                    select Pet_Id, Pet_Name, Pet_Race, Specie_Name, User_Name + ' ' + User_Lastname Owner_Name 
                    from ${PetTable}
                    join ${SpecieTable} on Specie_Id = Pet_SpecieId
                    join ${UserTable} on User_Id = Pet_UserId
                    WHERE Pet_IsDeleted = 0
                `);
            if (result.recordset.length === 0) {
                return new Error("No pets found");
            }
            return result.recordset;
        } catch (error) {
            console.error("Error fetching pets:", error);
            return new Error("Error fetching pets");
        }
    }

    createPet = async (pet) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input("Nombre", sql.NVarChar, pet.nombre)
                .input("Especie", sql.Int, pet.especieId)
                .input("Raza", sql.NVarChar, pet.raza)
                .input("FechaNac", sql.Date, pet.fechaNac)
                .input("Tamaño", sql.NVarChar, pet.tamaño)
                .input("Peso", sql.Float, pet.peso)
                .input("IdUsuario", sql.Int, pet.idUsuario)
                .query(`
                    INSERT INTO ${PetTable} (Pet_Name, Pet_SpecieId, Pet_Race, Pet_BirthDate, Pet_Size, Pet_UserId, Pet_Weight, Pet_IsDeleted)
                    VALUES (@Nombre, @Especie, @Raza, @FechaNac, @Tamaño, @IdUsuario, @Peso, 0)
                `);
            if (result.rowsAffected[0] === 0) {
                return new Error("Error creating pet");
            }
            return true;
        } catch (error) {
            console.error("Error creating pet:", error);
            return new Error("Error creating pet");
        }
    }

    deletePet = async (petId) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input("IdMascota", sql.Int, petId)
                .query(`
                    UPDATE ${PetTable}
                    SET Pet_IsDeleted = 1
                    WHERE Pet_Id = @IdMascota 
                `);
            if (result.rowsAffected[0] === 0) {
                return new Error("Error deleting pet");
            }
            return true;
        } catch (error) {
            console.error("Error deleting pet:", error);
            return new Error("Error deleting pet");
        }
    }

    updatePet = async (petId, petData) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input("IdMascota", sql.Int, petId)
                .input("Raza", sql.NVarChar, petData.raza)
                .input("FechaNac", sql.Date, petData.fechaNac)
                .input("Tamaño", sql.NVarChar, petData.tamaño)
                .input("Peso", sql.Float, petData.peso)
                .query(`
                    UPDATE ${PetTable}
                    SET Pet_Race = @Raza, Pet_BirthDate = @FechaNac, Pet_Size = @Tamaño, Pet_Weight = @Peso
                    WHERE Pet_Id = @IdMascota
                `);
            if (result.rowsAffected[0] === 0) {
                return new Error("Error modifying pet");
            }
            return true;
        } catch (error) {
            console.error("Error modifying pet:", error);
            return new Error("Error modifying pet");
        }
    }

}