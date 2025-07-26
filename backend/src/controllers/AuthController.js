import { Router } from "express";
import { AuthService } from "../services/AuthService.js";
const router = Router();
const authService = new AuthService();

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'ERROR: email y password son obligatorios.' });
  }

  try {
    const user = await authService.loginUser(email, password);
    if (user instanceof Error) {
      return res.status(401).json({ error: user.message });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ error: 'ERROR: No se pudo iniciar sesión.' });
  }
});

// POST register
router.post('/register', async (req, res) => {
  var nuevo = req.body;
  if (!nuevo?.nombre || !nuevo?.email || !nuevo?.password || !nuevo?.apellido) {
    return res.status(400).json({ error: 'ERROR: Uno de los campos obligatorios está vacío.' });
  }

  try {
    const response = await authService.registerUser(nuevo);
    if (response instanceof Error) {
      return res.status(500).json({ error: response.message });
    }
    return res.status(201).json({ message: response });
  } catch (err) {
    console.error('Error en registro:', err);
    return res.status(500).json({ error: 'ERROR: No se pudo registrar el usuario.' });
  }
});

// GET send mail confirmation
router.get('/send-mail-confirmation/:email', async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ error: 'ERROR: Se debe proporcionar un email.' });
  }
  
  try {
    const message = await authService.sendMailConfirmation(email);
    if (message instanceof Error) {
      return res.status(500).json({ error: message.message });
    }
    return res.status(200).json({ message: message });
  } catch (err) {
    console.error('Error al enviar correo de verificación:', err);
    return res.status(500).json({ error: 'ERROR: No se pudo enviar el correo de verificación.' });
  }
});

// GET verify email
router.get('/verify-email/:email/:codigo', async (req, res) => {
  const { email, codigo } = req.params;
  if (!email || !codigo) {
    return res.status(400).json({ error: 'ERROR: Se debe proporcionar un email y un código.' });
  }

  try {
    const response = await authService.verifyEmail(email, codigo);
    if (response instanceof Error) {
      return res.status(500).json({ error: response.message });
    }
    return res.status(200).json({ message: response });
  } catch (err) {
    console.error('Error al verificar email:', err);
    return res.status(500).json({ error: 'ERROR: No se pudo verificar el email.' });
  }
});

export default router;