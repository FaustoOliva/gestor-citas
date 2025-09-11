import { Router } from "express";
import { FrontService } from "../services/FrontService.js";
const router = Router();
const frontService = new FrontService();

router.get("/species", async (req, res) => {
  try {
    const species = await frontService.getSpecies();
    
    res.status(200).json(species);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/services/species/:specieId", async (req, res) => {
  try {
    const services = await frontService.getServicesBySpecie(
      req.params.specieId,
    );
    
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/services", async (req, res) => {
  try {
    const services = await frontService.getServices();
    
    res.status(200).json(services);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/dashboard/stats", async (req, res) => {
  try {
    const stats = await frontService.getDashboardStats();
    res.status(200).json(stats);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
