import express from 'express';
import cors from 'cors';
import PacientRouter from './src/controllers/PacientsController.js';
import AuthRouter from './src/controllers/AuthController.js';

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.use("/pacients", PacientRouter);
app.use("/login", AuthRouter);


app.listen(port, () => {
  console.log(`API backend corriendo en http://localhost:${port}`);
});
