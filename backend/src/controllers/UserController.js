import { Router } from "express";
import { UserService } from "../services/UserService.js";

const router = Router();
const userService = new UserService();

router.delete('/:id', async (req, res) => {
    console.log('This is a function on the controller');
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'ERROR: Se debe proporcionar un ID válido.' });
    }
    try {
        const mensaje = await userService.deleteUser(userId);
        if (mensaje instanceof Error) {
            return res.status(500).json({ error: 'ERROR: No se pudo eliminar el usuario.' });
        }
        return res.status(200).json({ mensaje: 'Usuario eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        return res.status(500).json({ error: 'ERROR: No se pudo eliminar el usuario.' });

    }

});


router.get('/:id', async (req, res) => {
    console.log('This is a function on the controller');
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'ERROR: Se debe proporcionar un ID válido.' });
    }
    try {
        const data = await userService.getUserById(userId);
        if (data instanceof Error) {
            return res.status(500).json({ error: 'ERROR: No se pudo obtener el usuario.' });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return res.status(500).json({ error: 'ERROR: No se pudo obtener el usuario.' });
    }
});

router.get("/", async (req, res) => {
    console.log('This is a function on the controller');
    try {
        const data = await userService.getUsers();
        if (data instanceof Error) {
            return res.status(400).json({ error: 'ERROR: No se pudo obtener la lista de usuarios.' });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        return res.status(500).json({ error: 'ERROR: No se pudo obtener la lista de usuarios.' });
    }
});

router.put("/:id", async (req, res) => {
    console.log('This is a function on the controller');
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId) || !req.body) {
        return res.status(400).json({ error: 'ERROR: Se debe proporcionar un ID válido y un cuerpo de solicitud.' });
    }
    try {
        const mensaje = await userService.updateUser(userId, req.body);
        if (mensaje instanceof Error) {
            return res.status(500).json({ error: 'ERROR: No se pudo actualizar el usuario.' });
        }
        return res.status(200).json({ mensaje: 'Usuario actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return res.status(500).json({ error: 'ERROR: No se pudo actualizar el usuario.' });
    }
});

export default router;