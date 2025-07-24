import { Router } from "express";

const router = Router();

// POST login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const data = JSON.parse(fs.readFileSync(RUTA_JSON));
  const usuario = data.find(p => p.email === email && p.password === password);
  if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });
  res.json({ id: usuario.id, nombre: usuario.nombre });
});

export default router;