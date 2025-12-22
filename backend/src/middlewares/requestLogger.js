import morgan from "morgan";
import { logger } from "../utils/logger.js";

export const requestLogger = morgan("tiny", {
  stream: {
    write: (msg) => logger.info(msg.trim()),
  },
});
