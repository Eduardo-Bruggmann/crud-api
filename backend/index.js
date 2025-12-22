import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requestLogger } from "./src/middlewares/requestLogger.js";
import routes from "./src/routes/routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use("/avatars", express.static("uploads/avatars"));

app.use("/api", routes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
