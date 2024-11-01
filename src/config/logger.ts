import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';
import dotenv from "dotenv";

dotenv.config({path: '.env'});
const { combine, timestamp, printf, colorize, errors, json } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        errors({ stack: true }),
        json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.Console({
            format: combine(colorize(), logFormat)
        }),
    ],
});

if (process.env.NODE_ENV === 'production') {
    logger.add( new transports.MongoDB({
        level: 'error',
        db: process.env.DATABASE!.replace('<DATABASE_PASSWORD>', process.env.DATABASE_PASSWORD!),
        collection: 'server_logs',
        tryReconnect: true,
        format: combine(timestamp(), json()),
    }));

    logger.add(new transports.File({
        filename: 'logs/combined.log',
        level: 'info',
        format: combine(timestamp(), json())
    }));

    logger.add(new transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: combine(timestamp(), json())
    }));
}

export default logger;
