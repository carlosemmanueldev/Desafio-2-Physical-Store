import express from 'express';
import AppError from "./utils/appError";
import storeRouter from "./routes/storeRoutes";
import {globalErrorHandler} from "./controllers/errorController";

const app = express();

app.use(express.json());

app.use('/api/v1/stores', storeRouter);

app.all('*', (req, res, next) => {
   next(new AppError(`Não foi possível encontrar ${req.originalUrl} neste servidor!`, 404));
});

app.use(globalErrorHandler);

export default app;