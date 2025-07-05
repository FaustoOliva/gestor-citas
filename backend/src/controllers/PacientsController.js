import { Router } from "express";
import fs from 'fs';
import crypto from 'crypto';
const RUTA_JSON = './pacientes.json';
const router = Router();

const createHashedId = (email) => {
    const timestamp = Date.now().toString();
    const dataToHash = email + timestamp;
    return crypto.createHash('sha256').update(dataToHash).digest('hex');
}

// GET pacientes
router.get('', (req, res) => {
    const data = JSON.parse(fs.readFileSync(RUTA_JSON));
    res.json(data);
});

// POST paciente nuevo
router.post('', (req, res) => {
    const nuevo = req.body;
    const data = JSON.parse(fs.readFileSync(RUTA_JSON));
    if (!nuevo?.nombre || !nuevo?.email || !nuevo?.password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (data.some(p => p?.email === nuevo?.email)) {
        return res.status(409).json({ error: 'Email ya registrado' });
    }
    
    // Hashear el ID basado en el email y un timestamp
    nuevo?.id = createHashedId(nuevo?.email);
    
    data.push(nuevo);
    fs.writeFileSync(RUTA_JSON, JSON.stringify(data, null, 2));
    res.status(201).json({ mensaje: 'Registrado correctamente', id: nuevo?.id });
});


export default router;