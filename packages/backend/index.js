import express from "express";
import cors from "cors";
import UserRouter from "./src/controllers/UserController.js";
import AppointmentRouter from "./src/controllers/AppointmentController.js";
import AuthRouter from "./src/controllers/AuthController.js";
import PetRouter from "./src/controllers/PetConstroller.js";
import FrontRouter from "./src/controllers/FrontController.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/users", UserRouter);
app.use("/appointments", AppointmentRouter);
app.use("/auth", AuthRouter);
app.use("/pets", PetRouter);
app.use("/front", FrontRouter);

app.listen(port, () => {
  console.log(`API backend corriendo en http://localhost:${port}`);
});
