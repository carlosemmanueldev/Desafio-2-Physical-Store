import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from "./app";

process.on('uncaughtException', err => {
    console.log('An Uncaught Exception ocurred. System is shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({path: '.env'});

const DB = process.env.DATABASE!.replace('<DATABASE_PASSWORD>', process.env.DATABASE_PASSWORD!);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log('Server is running on http://localhost:3000');
});

process.on('unhandledRejection', (err: Error) => {
    console.log('An Unhandled Rejection ocurred. System is shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
