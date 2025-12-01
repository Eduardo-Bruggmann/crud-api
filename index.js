import express from "express";
import dotenv from "dotenv";
import routes from "./src/routes/routes.js";
import cors from "cors";
import { requestLogger } from "./src/middlewares/requestLogger.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.use("/api", routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
