import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 5000;

const RUTA_JSON = './pacientes.json';

app.use(cors());
app.use(express.json());

// GET pacientes
app.get('/pacientes', (req, res) => {
  const data = JSON.parse(fs.readFileSync(RUTA_JSON));
  res.json(data);
});

// POST paciente nuevo
app.post('/pacientes', (req, res) => {
  const nuevo = req.body;
  const data = JSON.parse(fs.readFileSync(RUTA_JSON));
  if (data.some(p => p.email === nuevo.email)) {
    return res.status(409).json({ error: 'Email ya registrado' });
  }
  data.push(nuevo);
  fs.writeFileSync(RUTA_JSON, JSON.stringify(data, null, 2));
  res.status(201).json({ mensaje: 'Registrado correctamente' });
});

// POST login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const data = JSON.parse(fs.readFileSync(RUTA_JSON));
  const usuario = data.find(p => p.email === email && p.password === password);
  if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });
  res.json({ id: usuario.id, nombre: usuario.nombre });
});

app.listen(port, () => {
  console.log(`API backend corriendo en http://localhost:${port}`);
});
