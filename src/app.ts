import express from 'express';
import AppError from "./utils/appError";
import storeRouter from "./routes/storeRoutes";
import {globalErrorHandler} from "./controllers/errorController";
import logger from "./config/logger";

const app = express();

app.use((req, res, next) => {
   logger.info(`Requisição recebida: ${req.method} ${req.url}`);
   next();
});

app.use(express.json());

app.use('/api/v1/stores', storeRouter);

app.all('*', (req, res, next) => {
   const message = `Não foi possível encontrar ${req.originalUrl} neste servidor!`;
   logger.warn(message);
   next(new AppError(message, 404));
});

app.use(globalErrorHandler);

export default app;