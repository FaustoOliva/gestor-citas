import express from 'express';
import cors from 'cors';
import PacientRouter from './src/controllers/PacientsController.js';
import AuthRouter from './src/controllers/AuthController.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/pacients", PacientRouter);
app.use("/auth", AuthRouter);


app.listen(port, () => {
  console.log(`API backend corriendo en http://localhost:${port}`);
});
