import { Router } from "express";
import { AuthService } from "../services/AuthService.js";
const router = Router();
const authService = new AuthService();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "ERROR: email y password son obligatorios." });
  }

  try {
    const user = await authService.loginUser(email, password);
    if (user instanceof Error) {
      return res.status(401).json({ error: user.message });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "ERROR: No se pudo iniciar sesión." });
  }
});

router.post("/register", async (req, res) => {
  var nuevo = req.body;
  if (!nuevo?.nombre || !nuevo?.email || !nuevo?.password || !nuevo?.apellido) {
    return res
      .status(400)
      .json({ error: "ERROR: Uno de los campos obligatorios está vacío." });
  }

  try {
    await authService.registerUser(nuevo);

    return res.status(201).json({ message: "Usuario registrado con éxito." });
  } catch (err) {
    console.error("Error en registro:", err);
    return res
      .status(500)
      .json({ error: "ERROR: No se pudo registrar el usuario." });
  }
});

router.get("/send-mail-confirmation/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res
      .status(400)
      .json({ error: "ERROR: Se debe proporcionar un email." });
  }

  try {
    const message = await authService.sendMailConfirmation(email);
    if (message instanceof Error) {
      return res.status(500).json({ error: message.message });
    }
    return res.status(200).json({ message: message });
  } catch (err) {
    console.error("Error al enviar correo de verificación:", err);
    return res
      .status(500)
      .json({ error: "ERROR: No se pudo enviar el correo de verificación." });
  }
});

router.post("/verify-email", async (req, res) => {
  const { email, codigo } = req.body;
  if (!email || !codigo) {
    return res
      .status(400)
      .json({ error: "ERROR: Se debe proporcionar un email y un código." });
  }

  try {
    const response = await authService.verifyEmail(email, codigo);
    if (response instanceof Error) {
      return res.status(500).json({ error: response.message });
    }
    return res.status(200).json({ message: response });
  } catch (err) {
    console.error("Error al verificar email:", err);
    return res
      .status(500)
      .json({ error: "ERROR: No se pudo verificar el email." });
  }
});

router.post("/renew-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ error: "ERROR: email y nueva contraseña son obligatorios." });
  }

  try {
    await authService.renewPassword(email, newPassword);
    return res.status(200).json({ message: "Contraseña renovada con éxito." });
  } catch (err) {
    console.error("Error al renovar contraseña:", err);
    return res
      .status(500)
      .json({ error: "ERROR: No se pudo renovar la contraseña." });
  }
});

export default router;
