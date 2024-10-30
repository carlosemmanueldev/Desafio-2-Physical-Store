import {NextFunction, Response, Request} from "express";
import AppError from "../utils/appError";
import {Error as MongooseError, mongo as MongoDB} from "mongoose";

const handleCastErrorDB = (err: MongooseError.CastError) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err: MongoDB.MongoServerError) => {
    const value: string = err.keyValue.name;
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = (err: MongooseError.ValidationError) => {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const sendErrorDev = (err: CustomError, res: Response) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        res.status(500).json({
            status: 'error',
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
}

const sendErrorProd = (err: CustomError, res: Response) => {
    console.error('ERROR: ', err);

    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    })
}

const sendErrorProdOperational = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}

type CustomError = AppError | MongooseError | MongoDB.MongoServerError | Error;

export const globalErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';
    }

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        switch (true) {
            case err instanceof MongoDB.MongoServerError && err.code === 11000:
                err = handleDuplicateFieldsDB(err); // duplicate field
                break;
            case err instanceof MongooseError.CastError && err.name === 'CastError':
                err = handleCastErrorDB(err); // invalid id
                break;
            case err instanceof MongooseError.ValidationError && err.name === 'ValidationError':
                err = handleValidationErrorDB(err); // validation error
                break;
            default:
                break;
        }

        if (err instanceof AppError && err.isOperational) sendErrorProdOperational(err, res);
        else sendErrorProd(err, res);
    }
}