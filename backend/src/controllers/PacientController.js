import { Router } from "express";
import { PacientService } from "../services/PacientService";
import { hashingPassword } from "../utils/hash.js";

const router = Router();
const pacientService = new PacientService();

router.delete('/:id', async (req, res) => {
    console.log('This is a function on the controller');
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'ERROR: Se debe proporcionar un ID.' });
    }
    const mensaje = await pacientService.deletePacientById(id);
    if (mensaje instanceof Error) {
        return res.status(500).json({ error: 'ERROR: No se pudo eliminar el paciente.' });
    }
    return res.status(200).json({ mensaje: 'Paciente eliminado correctamente.' });
});


// GET pacient by ID or Email
router.get('', (req, res) => {
    console.log('This is a function on the controller');
    if (req.query.email) {
        const data = pacientService.getPacientByEmail(req.query.email);
        if (data instanceof Error) {
            return res.status(500).json({ error: 'ERROR: No se pudo obtener el paciente.' });
        }
        return res.status(200).json(data);
    }
    if (req.query.id) {
        const data = pacientService.getPacientById(req.query.id);
        if (data instanceof Error) {
            return res.status(500).json({ error: 'ERROR: No se pudo obtener el paciente.' });
        }
        return res.status(200).json(data);
    }
    return res.status(400).json({ error: 'ERROR: Se debe proporcionar un dato del paciente.' });
});

// POST paciente nuevo
router.post('', (req, res) => {
    var nuevo = req.body;
    if (!nuevo?.nombre || !nuevo?.email || !nuevo?.password || !nuevo?.apellido) {
        return res.status(400).json({ error: 'ERROR: Uno de los campos obligatorios está vacío.' });
    }
    nuevo.password = hashingPassword(nuevo.password);
    if (nuevo.password instanceof Error) {
        return res.status(500).json({ error: 'ERROR: No se pudo crear el paciente.' });
    }

    const mensaje = pacientService.createPacient(nuevo);
    if (mensaje instanceof Error) {
        return res.status(500).json({ error: 'ERROR: No se pudo crear el paciente.' });
    }

    return res.status(201).json({ mensaje: 'Registrado correctamente'});
});


export default router;