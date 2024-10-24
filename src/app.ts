import express, { Request, Response } from 'express';
import storeRouter from "./routes/storeRoutes";

const app = express();

app.use(express.json());

app.use('/', storeRouter);

export default app;