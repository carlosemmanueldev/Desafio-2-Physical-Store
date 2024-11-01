import express, {Request, Response, NextFunction} from 'express';
import AppError from "./utils/appError";
import storeRouter from "./routes/storeRoutes";
import {globalErrorHandler} from "./controllers/errorController";
import logger from "./config/logger";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
   logger.info(`Request received: ${req.method} ${req.url}`);
   next();
});

app.use(express.json());

app.use('/api/v1/stores', storeRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
   const message = `Could not find ${req.originalUrl} on this server!`;
   logger.warn(message);
   next(new AppError(message, 404));
});

app.use(globalErrorHandler);

export default app;