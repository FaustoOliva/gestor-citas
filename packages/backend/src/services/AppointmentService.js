import db from "../../db.js";
import "dotenv/config";

const { sql, poolPromise } = db;
const AppointmentTable = process.env.DB_APPOINTMENT_TABLE;
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
          );
          SELECT SCOPE_IDENTITY() AS AppointmentId;
          `
        );
      if (result.rowsAffected[0] === 0 || !result.recordset[0].AppointmentId) {
        throw new Error("Error creating appointment");
      }
      return {
        id: result.recordset[0].AppointmentId,
      };
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw new Error("Error creating appointment");
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
              INSERT INTO ${AppointmentDetailsTable} (Details_AppointmentId, Details_FieldId, Details_Value)
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
                A.Appointment_Id AS id,
                A.Appointment_Date AS date,
                P.Pet_Name AS petName,
                S.Service_Name AS serviceName,
                ST.Status_Description AS status,
                S.Service_MinutesDuration AS durationMinutes,
                S.Service_Price AS price,
                S.Service_Description AS description
              FROM ${AppointmentTable} AS A
              JOIN ${PetTable} AS P ON A.Appointment_PetId = P.Pet_Id
              JOIN ${ServiceTable} AS S ON A.Appointment_ServiceId = S.Service_Id
              JOIN ${StatusTable} AS ST ON A.Appointment_StatusId = ST.Status_Id
              WHERE A.Appointment_UserId = @UserId
              ORDER BY A.Appointment_Date ASC;`);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset;
    } catch (error) {
      console.error("Error fetching appointments by user ID:", error);
      throw new Error("Error fetching appointments by user ID");
    }
  };

  getAppointmentsByPetId = async (petId) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().input("PetId", sql.Int, petId).query(`
              SELECT
                A.Appointment_Id AS id,
                A.Appointment_Date AS date,
                S.Service_Name AS serviceName,
                ST.Status_Description AS status
              FROM ${AppointmentTable} AS A
              JOIN ${ServiceTable} AS S ON A.Appointment_ServiceId = S.Service_Id
              JOIN ${StatusTable} AS ST ON A.Appointment_StatusId = ST.Status_Id
              WHERE A.Appointment_PetId = @PetId
              ORDER BY A.Appointment_Date ASC;`);
      if (result.recordset.length === 0) {
        return [];
      }
      return result.recordset;
    } catch (error) {
      console.error("Error fetching appointments by user ID:", error);
      throw new Error("Error fetching appointments by user ID");
    }
  };

  getAppointments = async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
                    SELECT
                      A.Appointment_Id AS id,
                      A.Appointment_Date AS date,
                      U.User_Id AS userId,
                      (U.User_Name + ' ' + U.User_Lastname) AS ownerName,
                      P.Pet_Id AS petId,
                      P.Pet_Name AS petName,
                      S.Service_Name AS serviceName,
                      ST.Status_Description AS status
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

      const appointments = result.recordset.map((appointment) => ({
        id: appointment.appointmentId,
        date: appointment.appointmentDate,
        status: appointment.appointmentStatus,
        user: {
          id: appointment.userId,
          name: appointment.ownerName,
        },
        pet: {
          id: appointment.petId,
          name: appointment.petName,
        },
        service: {
          id: appointment.serviceId,
          name: appointment.serviceName,
        },
      }));

      return appointments;
    } catch (error) {
      console.error("Error fetching all appointments:", error);
      throw new Error("Error fetching all appointments");
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
                A.Appointment_Id AS id,
                A.Appointment_Date AS date,
                S.Service_Name AS serviceName,
                S.Service_Id AS serviceId,
                P.Pet_Name AS petName,
                P.Pet_Id AS petId,
                U.User_Name AS userName,
                U.User_Id AS userId,
                ST.Status_Description AS status
              FROM ${AppointmentTable} AS A
              JOIN ${UserTable} AS U ON A.Appointment_UserId = U.User_Id
              JOIN ${PetTable} AS P ON A.Appointment_PetId = P.Pet_Id
              JOIN ${ServiceTable} AS S ON A.Appointment_ServiceId = S.Service_Id
              JOIN ${StatusTable} AS ST ON A.Appointment_StatusId = ST.Status_Id
              WHERE A.Appointment_Id = @AppointmentId
                `);
      if (result.recordset.length === 0) {
        return [];
      }
      const appointment = {
        id: result.recordset[0].id,
        date: result.recordset[0].date,
        status: result.recordset[0].status,
        service: {
          id: result.recordset[0].serviceId,
          name: result.recordset[0].serviceName,
        },
        pet: {
          id: result.recordset[0].petId,
          name: result.recordset[0].petName,
        },
        user: {
          id: result.recordset[0].userId,
          name: result.recordset[0].userName,
        },
      };

      return appointment;
    } catch (error) {
      console.error("Error fetching appointment by ID:", error);
      throw new Error("Error fetching appointment by ID");
    }
  };
}
