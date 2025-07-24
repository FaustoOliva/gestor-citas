import { Router } from "express";
import { AuthService } from "../services/AuthService";
const router = Router();
const authService = new AuthService();

// POST login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'ERROR: Email y contraseña son obligatorios.' });
  }

});

// POST register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'ERROR: Email, contraseña y nombre son obligatorios.' });
  }

  // Aquí se llamaría al servicio para crear el usuario
  // const result = await authService.registerUser({ email, password, name });

  // if (result instanceof Error) {
  //   return res.status(500).json({ error: 'ERROR: No se pudo registrar el usuario.' });
  // }

  return res.status(201).json({ message: 'Usuario registrado correctamente.' });
});

export default router;