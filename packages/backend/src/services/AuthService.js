import mail from "../utils/mailer.js";
import "dotenv/config";
import hash from "../utils/hashing.js";
import { UserService } from "./UserService.js";

const { sendCodeVerification } = mail;
const { hashingPassword, comparePassword } = hash;
const userService = new UserService();

export class AuthService {
  registerUser = async (User) => {
    console.log("This is a function on the service");
    
    User.password = await hashingPassword(User.password);
    if (User.password instanceof Error) {
      throw new Error("ERROR: No se pudo hashear la contraseña.");
    }

    return await userService.createUser(User);
  };

  loginUser = async (email, password) => {
    console.log("This is a function on the service");

    try {
      const user = await userService.getUserByEmail(email);
      if (user instanceof Error || !user) {
        return new Error("ERROR: No se pudo obtener el usuario.");
      }
      console.log("Usuario obtenido:", user);
      const passwordMatch = await comparePassword(password, user.password);
      if (passwordMatch instanceof Error || !passwordMatch) {
        return new Error("Contraseña incorrecta");
      }

      return user;
    } catch (error) {
      console.error("Error al hacer login:", error);
      return new Error("ERROR: No se pudo autenticar el usuario.");
    }
  };

  sendMailConfirmation = async (email) => {
    console.log("This is a function on the service");
    const codigoGenerado = Math.floor(100000 + Math.random() * 900000); // Genera un código aleatorio de 6 dígitos

    try {
      const user = await userService.getUserByEmail(email);
      if (user instanceof Error) {
        console.error("Error al obtener el usuario:", user);
        return new Error("ERROR: No se pudo obtener el usuario.");
      }
      console.log("Usuario obtenido:", user);

      const response = await userService.putFieldUserById(
        user.Id,
        "CodigoVerificacion",
        codigoGenerado,
      );
      if (response instanceof Error) {
        console.error("Error al guardar el código de verificación:", response);
        return new Error(
          "ERROR: No se pudo guardar el código de verificación.",
        );
      }
      console.log("Código de verificación guardado en la base de datos.");

      const info = await sendCodeVerification(email, codigoGenerado);
      if (info instanceof Error) {
        console.error("Error al enviar el correo de verificación:", info);
        return new Error("ERROR: No se pudo enviar el correo de verificación.");
      }
      console.log("Correo enviado:", info);

      return "Correo de confirmación enviado.";
    } catch (error) {
      console.error("Error en sendMailConfirmation:", error);
      return new Error(
        "ERROR: No se pudo procesar la confirmación por correo.",
      );
    }
  };

  verifyEmail = async (email, codigo) => {
    console.log("This is a function on the service");

    try {
      const user = await userService.getUserByEmail(email);
      if (user instanceof Error) {
        console.error("Error al obtener el usuario:", user);
        return new Error("ERROR: No se pudo obtener el usuario.");
      }

      if (user.CodigoVerificacion !== codigo) {
        return new Error("ERROR: Código de verificación incorrecto.");
      }

      const response = await userService.putFieldUserById(
        user.Id,
        "EmailVerificado",
        true,
      );
      if (response instanceof Error) {
        console.error("Error al verificar el email:", response);
        return new Error("ERROR: No se pudo verificar el email.");
      }

      return "Email verificado con éxito.";
    } catch (error) {
      console.error("Error en verifyEmail:", error);
      return new Error("ERROR: No se pudo procesar la verificación del email.");
    }
  };
}
