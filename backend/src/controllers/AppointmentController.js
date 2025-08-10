import { Router } from "express";
const router = Router();
import { AppointmentService } from "../services/AppointmentService.js";
const appointmentService = new AppointmentService();

router.post("", async (req, res) => {
  console.log('This is a function on the controller');
  if (!req.body) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { userId, speciesId, serviceId, fields } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  if (!speciesId) {
    return res.status(400).json({ error: "Specie is required" });
  }
  if (!serviceId) {
    return res.status(400).json({ error: "Service is required" });
  }
  try {
    const appointment = await appointmentService.createAppointment(userId, speciesId, serviceId, fields);
    if (appointment instanceof Error) {
      return res.status(400).json({ error: appointment.message });
    }
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/species", async (req, res) => {
  try {
    const species = await appointmentService.getSpecies();
    if (species instanceof Error) {
      return res.status(500).json({ error: species.message });
    }
    res.status(200).json(species);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/services/:specie", async (req, res) => {
  try {
    const services = await appointmentService.getServicesBySpecie(req.params.specie);
    if (services instanceof Error) {
      return res.status(500).json({ error: services.message });
    }
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointmentsByUserId(req.params.userId);
    if (appointments instanceof Error) {
      return res.status(400).json({ error: appointments.message });
    }
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;