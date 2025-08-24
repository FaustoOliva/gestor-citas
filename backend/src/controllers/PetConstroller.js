import { Router } from "express";
import { PetService } from "../services/PetService.js";
const router = Router();

const petService = new PetService();

router.post('', async (req, res) => {
    console.log('This is a function on the controller');
    if (!req.body) {
        return res.status(400).json({ error: "Invalid request body" });
    }
    try {
        const pet = await petService.createPet(req.body);
        if (pet instanceof Error) {
            return res.status(400).json({ error: pet.message });
        }
        res.status(201).json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    const petId = parseInt(req.params.id, 10);
    if (isNaN(petId)) {
        return res.status(400).json({ error: "Invalid pet ID" });
    }
    try {
        const pet = await petService.getPetById(petId);
        if (pet instanceof Error) {
            return res.status(404).json({ error: pet.message });
        }
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/users/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }
    try {
        const pets = await petService.getPetsByUserId(userId);
        if (pets instanceof Error) {
            return res.status(404).json({ error: pets.message });
        }
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('', async (req, res) => {
    try {
        const pets = await petService.getPets();
        if (pets instanceof Error) {
            return res.status(404).json({ error: pets.message });
        }
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put('/:id', async (req, res) => {
    const petId = parseInt(req.params.id, 10);
    if (isNaN(petId) || !req.body) {
        return res.status(400).json({ error: "Invalid request" });
    }
    try {
        const updatedPet = await petService.updatePet(petId, req.body);
        if (updatedPet instanceof Error) {
            return res.status(404).json({ error: updatedPet.message });
        }
        res.status(200).json(updatedPet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    const petId = parseInt(req.params.id, 10);
    if (isNaN(petId)) {
        return res.status(400).json({ error: "Invalid pet ID" });
    }
    try {
        const result = await petService.deletePet(petId);
        if (result instanceof Error) {
            return res.status(404).json({ error: result.message });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;