import db from "../../db.js";
import "dotenv/config";
const { sql, poolPromise } = db;

const PetTable = process.env.DB_PET_TABLE;
const SpecieTable = process.env.DB_SPECIE_TABLE;
const UserTable = process.env.DB_USER_TABLE;

export class PetService {
  getPetsByUserId = async (userId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().input("IdUsuario", sql.Int, userId)
        .query(`
              SELECT 
                Pet_Id AS id,
                Pet_Name AS name,
                Pet_Breed AS breed,
                Specie_Id AS specieId,
                Specie_Name AS specieName,
                Pet_Weight AS weight,
                Pet_BirthDate AS birthDate,
                Pet_Size AS size
              FROM ${PetTable}
              JOIN ${SpecieTable} ON Specie_Id = Pet_SpecieId
              JOIN ${UserTable} ON User_Id = Pet_UserId AND User_Id = @IdUsuario
              WHERE Pet_IsDeleted = 0
                `);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset;
    } catch (error) {
      console.error("Error fetching pets by user ID:", error);
      throw new Error("Error fetching pets by user ID");
    }
  };

  getPetById = async (petId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().input("PetId", sql.Int, petId).query(`
                    SELECT 
                      Pet_Id AS id,
                      Pet_Name AS name,
                      Pet_Breed AS breed,
                      Pet_BirthDate AS birthDate,
                      Pet_Size AS size,
                      Pet_Weight AS weight,
                      Specie_Name AS specieName
                    FROM ${PetTable} 
                    JOIN ${SpecieTable} ON Specie_Id = Pet_SpecieId
                    WHERE Pet_Id = @PetId AND Pet_IsDeleted = 0
                `);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset[0];
    } catch (error) {
      console.error("Error fetching pet by ID:", error);
      throw new Error("Error fetching pet by ID");
    }
  };

  getPets = async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
                    SELECT 
                      Pet_Id AS id,
                      Pet_Name AS name,
                      Pet_Breed AS breed,
                      Specie_Name AS specieName,
                      (User_Name + ' ' + User_Lastname) AS ownerName
                    FROM ${PetTable}
                    JOIN ${SpecieTable} ON Specie_Id = Pet_SpecieId
                    JOIN ${UserTable} ON User_Id = Pet_UserId
                    WHERE Pet_IsDeleted = 0
                `);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset;
    } catch (error) {
      console.error("Error fetching pets:", error);
      throw new Error("Error fetching pets");
    }
  };

  createPet = async (pet) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("Nombre", sql.NVarChar, pet.name)
        .input("Especie", sql.Int, pet.specieId)
        .input("Raza", sql.NVarChar, pet.breed)
        .input("FechaNac", sql.Date, pet.birthDate)
        .input("Tamaño", sql.NVarChar, pet.size)
        .input("Peso", sql.Float, pet.weight)
        .input("IdUsuario", sql.Int, pet.userId).query(`
                    INSERT INTO ${PetTable} (Pet_Name, Pet_SpecieId, Pet_Breed, Pet_BirthDate, Pet_Size, Pet_UserId, Pet_Weight, Pet_IsDeleted)
                    VALUES (@Nombre, @Especie, @Raza, @FechaNac, @Tamaño, @IdUsuario, @Peso, 0)
                `);
      if (result.rowsAffected[0] === 0) {
        throw new Error("Error creating pet");
      }
      return true;
    } catch (error) {
      console.error("Error creating pet:", error);
      throw new Error("Error creating pet");
    }
  };

  deletePet = async (petId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().input("IdMascota", sql.Int, petId)
        .query(`
              UPDATE ${PetTable}
                SET Pet_IsDeleted = 1
              WHERE Pet_Id = @IdMascota 
                `);
      if (result.rowsAffected[0] === 0) {
        throw new Error("Error deleting pet");
      }
      return true;
    } catch (error) {
      console.error("Error deleting pet:", error);
      throw new Error("Error deleting pet");
    }
  };

  updatePet = async (petId, petData) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("IdMascota", sql.Int, petId)
        .input("Nombre", sql.NVarChar, petData.name)
        .input("Raza", sql.NVarChar, petData.breed)
        .input("FechaNac", sql.Date, petData.birthDate)
        .input("Tamaño", sql.NVarChar, petData.size)
        .input("Peso", sql.Float, petData.weight).query(`
                    UPDATE ${PetTable}
                      SET Pet_Name = @Nombre, Pet_Breed = @Raza, Pet_BirthDate = @FechaNac, Pet_Size = @Tamaño, Pet_Weight = @Peso
                    WHERE Pet_Id = @IdMascota
                `);
      if (result.rowsAffected[0] === 0) {
        throw new Error("Error modifying pet");
      }
      return true;
    } catch (error) {
      console.error("Error modifying pet:", error);
      throw new Error("Error modifying pet");
    }
  };
}
