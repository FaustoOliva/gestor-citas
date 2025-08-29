import db from "../../db.js";
import "dotenv/config";

const { sql, poolPromise } = db;
const AppointmentTable = process.env.DB_APPOINTMENTS_TABLE;
const ServiceTable = process.env.DB_SERVICE_TABLE;
const UserTable = process.env.DB_USER_TABLE;
const PetTable = process.env.DB_PET_TABLE;
const StatusTable = process.env.DB_STATUS_TABLE;
const SpecieTable = process.env.DB_SPECIE_TABLE;
const AppointmentDetailsTable = process.env.DB_APPOINTMENT_DETAILS_TABLE;

export class AppointmentService {
  createAppointment = async (appointmentData) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("UserId", sql.Int, appointmentData.userId)
        .input("PetId", sql.Int, appointmentData.petId)
        .input("ServiceId", sql.Int, appointmentData.serviceId)
        .input("StatusId", sql.Int, appointmentData.statusId || 1)
        .input("Date", sql.DateTime, appointmentData.date)
        .query(
          `INSERT INTO ${AppointmentTable} (
            Appointment_UserId,
            Appointment_PetId,
            Appointment_ServiceId,
            Appointment_StatusId,
            Appointment_Date
          )
          VALUES (
              @UserId,
              @PetId,
              @ServiceId,
              @StatusId,
              @Date
          );`,
        );
      if (result.rowsAffected[0] === 0) {
        return new Error("Error creating appointment");
      }
      return true;
    } catch (error) {
      console.error("Error creating appointment:", error);
      return new Error("Error creating appointment");
    }
  };

  createAppointmentDetails = async (appointmentId, details) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("AppointmentId", sql.Int, appointmentId)
        .input("FieldId", sql.Int, details.fieldId)
        .input("FieldValue", sql.NVarChar, details.fieldValue).query(`
              INSERT INTO ${AppointmentDetailsTable} (AppointmentId, FieldId, FieldValue)
              VALUES (@AppointmentId, @FieldId, @FieldValue)
                `);
      if (result.rowsAffected[0] === 0) {
        throw new Error("Error creating appointment details");
      }
      return true;
    } catch (error) {
      console.error("Error creating appointment details:", error);
      throw new Error("Error creating appointment details");
    }
  };

  getAppointmentsByUserId = async (userId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().input("UserId", sql.Int, userId)
        .query(`
              SELECT
                A.Appointment_Id AS appointmentId,
                A.Appointment_Date AS appointmentDate,
                P.Pet_Name AS petName,
                S.Service_Name AS serviceName,
                ST.Status_Description AS appointmentStatus
              FROM ${AppointmentTable} AS A
              JOIN ${PetTable} AS P ON A.Appointment_PetId = P.Pet_Id
              JOIN ${ServiceTable} AS S ON A.Appointment_ServiceId = S.Service_Id
              JOIN ${StatusTable} AS ST ON A.Appointment_StatusId = ST.Status_Id
              WHERE A.Appointment_UserId = @UserId
              ORDER BY A.Appointment_Date DESC;`);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset;
    } catch (error) {
      console.error("Error fetching appointments by user ID:", error);
      return new Error("Error fetching appointments by user ID");
    }
  };

  getAppointmentsByPetId = async (petId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().input("PetId", sql.Int, petId).query(`
              SELECT
                A.Appointment_Id AS appointmentId,
                A.Appointment_Date AS appointmentDate,
                S.Service_Name AS serviceName,
                ST.Status_Description AS appointmentStatus
              FROM ${AppointmentTable} AS A
              JOIN ${ServiceTable} AS S ON A.Appointment_ServiceId = S.Service_Id
              JOIN ${StatusTable} AS ST ON A.Appointment_StatusId = ST.Status_Id
              WHERE A.Appointment_PetId = @PetId
              ORDER BY A.Appointment_Date DESC;`);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset;
    } catch (error) {
      console.error("Error fetching appointments by user ID:", error);
      return new Error("Error fetching appointments by user ID");
    }
  };

  getAppointments = async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
                    SELECT
                      A.Appointment_Id AS appointmentId,
                      A.Appointment_Date AS appointmentDate,
                      U.User_Id AS userId,
                      (U.User_Name + ' ' + U.User_Lastname) AS ownerName,
                      P.Pet_Id AS petId,
                      P.Pet_Name AS petName,
                      S.Service_Name AS serviceName,
                      ST.Status_Description AS appointmentStatus
                    FROM ${AppointmentTable} AS A
                    JOIN ${UserTable} AS U ON A.Appointment_UserId = U.User_Id
                    JOIN ${PetTable} AS P ON A.Appointment_PetId = P.Pet_Id
                    JOIN ${SpecieTable} AS SP ON P.Pet_SpecieId = SP.Specie_Id
                    JOIN ${ServiceTable} AS S ON A.Appointment_ServiceId = S.Service_Id
                    JOIN ${StatusTable} AS ST ON A.Appointment_StatusId = ST.Status_Id
                    ORDER BY A.Appointment_Date DESC;
                `);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset;
    } catch (error) {
      console.error("Error fetching all appointments:", error);
      return new Error("Error fetching all appointments");
    }
  };

  deleteAppointment = async (appointmentId) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("AppointmentId", sql.Int, appointmentId).query(`
              UPDATE ${AppointmentTable}
                SET Appointment_Status = 5
              WHERE Appointment_Id = @AppointmentId
                `);
      if (result.rowsAffected[0] === 0) {
        throw new Error("Error deleting appointment");
      }
      return true;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw new Error("Error deleting appointment");
    }
  };

  updateAppointment = async (appointmentId, appointmentData) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("AppointmentId", sql.Int, appointmentId)
        .input("Date", sql.DateTime, appointmentData.date)
        .input("ServiceId", sql.Int, appointmentData.serviceId)
        .input("StatusId", sql.Int, appointmentData.statusId).query(`
              UPDATE ${AppointmentTable}
              SET Appointment_Date = @Date,
                  Appointment_ServiceId = @ServiceId,
                  Appointment_StatusId = @StatusId
              WHERE Appointment_Id = @AppointmentId
                `);
      if (result.rowsAffected[0] === 0) {
        throw new Error("Error updating appointment");
      }
      return true;
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw new Error("Error updating appointment");
    }
  };

  getAppointmentById = async (appointmentId) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("AppointmentId", sql.Int, appointmentId).query(`
              SELECT
                A.Appointment_Id AS appointmentId,
                A.Appointment_Date AS appointmentDate,
                S.Service_Name AS serviceName,
                ST.Status_Description AS appointmentStatus
              FROM ${AppointmentTable} AS A
              JOIN ${ServiceTable} AS S ON A.Appointment_ServiceId = S.Service_Id
              JOIN ${StatusTable} AS ST ON A.Appointment_StatusId = ST.Status_Id

              WHERE A.Appointment_Id = @AppointmentId
                `);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset[0];
    } catch (error) {
      console.error("Error fetching appointment by ID:", error);
      throw new Error("Error fetching appointment by ID");
    }
  };
}
