import { Router } from "express";
import { PacientService } from "../services/PacientService.js";
import hash from "../utils/hashing.js";

const router = Router();
const pacientService = new PacientService();
const { hashingPassword } = hash;

router.delete('/:id', async (req, res) => {
    console.log('This is a function on the controller');
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'ERROR: Se debe proporcionar un ID.' });
    }
    try {
        const mensaje = await pacientService.deletePacientById(id);
        if (mensaje instanceof Error) {
            return res.status(500).json({ error: 'ERROR: No se pudo eliminar el paciente.' });
        }
        return res.status(200).json({ mensaje: 'Paciente eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        return res.status(500).json({ error: 'ERROR: No se pudo eliminar el paciente.' });

    }

});


// GET pacient by ID or Email
router.get('', async (req, res) => {
    console.log('This is a function on the controller');
    try {
        if (req.query.email) {
            const data = await pacientService.getPacientByEmail(req.query.email);
            if (data instanceof Error) {
                return res.status(500).json({ error: 'ERROR: No se pudo obtener el paciente.' });
            }
            return res.status(200).json(data);
        }
        if (req.query.id) {
            const data = await pacientService.getPacientById(req.query.id);
            if (data instanceof Error) {
                return res.status(500).json({ error: 'ERROR: No se pudo obtener el paciente.' });
            }
            return res.status(200).json(data);
        }
        return res.status(400).json({ error: 'ERROR: Se debe proporcionar un dato del paciente.' });

    } catch (error) {
        console.error('Error al obtener el paciente:', error);
        return res.status(500).json({ error: 'ERROR: No se pudo obtener el paciente.' });

    }

});

// POST paciente nuevo
// router.post('', (req, res) => {
//     var nuevo = req.body;
//     if (!nuevo?.nombre || !nuevo?.email || !nuevo?.password || !nuevo?.apellido) {
//         return res.status(400).json({ error: 'ERROR: Uno de los campos obligatorios está vacío.' });
//     }
//     nuevo.password = hashingPassword(nuevo.password);
//     if (nuevo.password instanceof Error) {
//         return res.status(500).json({ error: 'ERROR: No se pudo crear el paciente.' });
//     }

//     const mensaje = pacientService.createPacient(nuevo);
//     if (mensaje instanceof Error) {
//         return res.status(500).json({ error: 'ERROR: No se pudo crear el paciente.' });
//     }

//     return res.status(201).json({ mensaje: 'Registrado correctamente'});
// });


export default router;