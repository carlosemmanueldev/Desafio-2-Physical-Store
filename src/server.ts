import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from "./app";
import logger from "./config/logger";

process.on('uncaughtException', (err: Error) => {
    logger.error('An Uncaught Exception ocurred. System is shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
});

dotenv.config({path: '.env'});

const DB = process.env.DATABASE!.replace('<DATABASE_PASSWORD>', process.env.DATABASE_PASSWORD!);

mongoose.connect(DB).then(() => logger.info('DB connection successful')).catch((err: unknown) => logger.error(`Erro ao conectar com MongoDB: ${err}`));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    logger.info('Server is running on http://localhost:3000');
});

process.on('unhandledRejection', (err: Error) => {
    logger.error('An Unhandled Rejection ocurred. System is shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
