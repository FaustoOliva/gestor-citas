import db from "../../db.js";
import "dotenv/config";
import User from "../models/UserModel.js";

const { sql, poolPromise } = db;
const userTable = process.env.DB_USER_TABLE;

export class UserService {
  deleteUser = async (id) => {
    const text_exito = "Se ha borrado con exito.";

    try {
      const pool = await poolPromise;
      const response = await pool.request().input("Id", sql.Int, id).query(`
          UPDATE ${userTable} 
            SET User_IsDeleted = 1 
          WHERE Id = @Id`);

      if (response.rowsAffected[0] === 0) {
        throw new Error("ERROR: No se pudo eliminar el usuario.");
      }
      return text_exito;
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  };

  getUserById = async (id) => {
    let user;

    try {
      const pool = await poolPromise;
      user = await pool.request().input("Id", sql.Int, id).query(`
          SELECT 
            User_Id AS id,
            User_Nombre AS name,
            User_Apellido AS lastname,
            User_Email AS email,
            User_Phone AS phone,
            User_IsEmailVerified AS isEmailVerified,
            User_IsAdmin AS isAdmin
          FROM ${userTable} 
          WHERE User_Id = @Id`);

      if (user.recordset.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      return user.recordset[0];
    } catch (error) {
      console.error("Error al obtener el usuario por ID:", error);
      throw error;
    }
  };

  getUserByEmail = async (email) => {
    let user;

    try {
      const pool = await poolPromise;
      user = await pool.request().input("Email", sql.NVarChar, email).query(`
                    SELECT 
                        User_Id AS id, 
                        User_Name AS name, 
                        User_LastName AS lastname, 
                        User_Password AS password,
                        User_Email AS email, 
                        User_Phone AS phone,
                        User_IsEmailVerified AS isEmailVerified,
                        User_IsAdmin AS isAdmin
                    FROM ${userTable} 
                    WHERE User_Email = @Email`);

      if (user.recordset.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      return user.recordset[0];
    } catch (error) {
      console.error("Error al obtener el usuario por email:", error);
      throw error;
    }
  };

  putFieldUserById = async (id, field, value) => {
    // const fieldInfo = new User().fields[field];
    // if (!fieldInfo) {
    //   throw new Error(`ERROR: El campo ${field} no es válido.`);
    // }

    try {
      const pool = await poolPromise;
      const response = await pool
        .request()
        .input("Id", sql.Int, id ?? "")
        .input("value", sql.NVarChar, String(value) ?? "").query(`
          UPDATE ${userTable} 
            SET ${field} = @value 
          WHERE User_Id = @Id`);

      if (response.rowsAffected[0] === 0) {
        throw new Error(
          `ERROR: No se pudo actualizar el campo ${field} del usuario.`
        );
      }
      return 1;
    } catch (error) {
      console.error("Error al actualizar el campo del usuario:", error);
      throw error;
    }
  };

  getUsers = async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`SELECT 
                        User_Id AS id, 
                        User_Nombre AS name, 
                        User_Apellido AS lastname, 
                        User_Email AS email, 
                        User_Phone AS phone,
                        User_IsEmailVerified AS isEmailVerified,
                    FROM ${userTable} 
                    WHERE User_IsEmailVerified = 1 AND User_IsDeleted = 0 AND User_IsAdmin = 0`);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw error;
    }
  };

  createUser = async (user) => {
    try {
      const pool = await poolPromise;
      const response = await pool
        .request()
        .input("Apellido", sql.NVarChar, user?.lastname ?? null)
        .input("Nombre", sql.NVarChar, user?.name ?? null)
        .input("Email", sql.NVarChar, user?.email ?? null)
        .input("Telefono", sql.NVarChar, user?.phone ?? null)
        .input("FechaRegistro", sql.DateTime, new Date().toISOString())
        .input("PasswordHash", sql.NVarChar, user?.password ?? null)
        .input("EsAdmin", sql.Bit, user?.isAdmin ?? 0)
        .query(
          `INSERT INTO ${userTable}
          (User_Lastname, User_Name, User_Email, User_Phone, User_RegisterDate, User_PasswordHash, User_IsAdmin) 
          VALUES (@Apellido, @Nombre, @Email, @Telefono, @FechaRegistro, @PasswordHash, @EsAdmin)
          `
        );

      if (response.rowsAffected[0] === 0) {
        throw new Error("ERROR: No se pudo crear el usuario.");
      }

      return true;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  };

  updateUser = async (id, user) => {
    try {
      const pool = await poolPromise;
      const response = await pool
        .request()
        .input("Id", sql.Int, id ?? "")
        .input("Apellido", sql.NVarChar, user?.lastname ?? null)
        .input("Nombre", sql.NVarChar, user?.name ?? null)
        .input("Email", sql.NVarChar, user?.email ?? null)
        .input("Telefono", sql.NVarChar, user?.phone ?? null)
        .input("EsAdmin", sql.Bit, user?.isAdmin ?? 0).query(`
                    UPDATE ${userTable} SET 
                        User_Lastname = @Apellido, 
                        User_Name = @Nombre, 
                        User_Email = @Email, 
                        User_Phone = @Telefono
                    WHERE Id = @Id`);
      if (response.rowsAffected[0] === 0) {
        throw new Error("ERROR: No se pudo actualizar el usuario.");
      }

      return "Usuario actualizado con éxito.";
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  };
}
