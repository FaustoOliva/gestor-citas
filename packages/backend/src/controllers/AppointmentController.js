import { Router } from "express";
const router = Router();
import { AppointmentService } from "../services/AppointmentService.js";
const appointmentService = new AppointmentService();

router.post("", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  if (
    !req.body.userId ||
    !req.body.petId ||
    !req.body.serviceId ||
    !req.body.date ||
    !req.body.details
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let response = await appointmentService.createAppointment(req.body);
    if (response instanceof Error || !response.id) {
      return res.status(400).json({ error: response.message });
    }
    if (response) {
      for (const element of req.body.details) {
        await appointmentService.createAppointmentDetails(response.id, element);
      }
      return res.status(201).json({
        message: "Appointment created successfully",
        appointmentId: response.id,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/users/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  try {
    const appointments =
      await appointmentService.getAppointmentsByUserId(userId);
    if (appointments instanceof Error) {
      return res.status(400).json({ error: appointments.message });
    }
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/pets/:petId", async (req, res) => {
  const petId = parseInt(req.params.petId, 10);
  if (isNaN(petId)) {
    return res.status(400).json({ error: "Invalid pet ID" });
  }
  try {
    const appointments = await appointmentService.getAppointmentsByPetId(petId);
    if (appointments instanceof Error) {
      return res.status(400).json({ error: appointments.message });
    }
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("", async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointments();
    if (appointments instanceof Error) {
      return res.status(400).json({ error: appointments.message });
    }
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }
  try {
    const appointment = await appointmentService.getAppointmentById(id);
    if (appointment instanceof Error) {
      return res.status(400).json({ error: appointment.message });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }
  try {
    const result = await appointmentService.deleteAppointment(id);
    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }
  if (!req.body) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  if (!req.body.date || !req.body.serviceId || !req.body.statusId) {
    return res
      .status(400)
      .json({ error: "Date, Service ID and Status ID are required" });
  }
  try {
    const result = await appointmentService.updateAppointment(id, req.body);
    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }
    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
