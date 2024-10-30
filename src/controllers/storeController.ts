import Store from './../models/storeModel';
import catchAsync from './../utils/catchAsync';
import {NextFunction, Request, Response} from 'express';
import {calculateCoordinates} from "../utils/location";
import AppError from "../utils/appError";

export const getStores = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stores = await Store.find();

    res.status(200).json({
        status: 'success',
        results: stores.length,
        data: {
            stores
        }
    });
});

export const createStore = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const store = await Store.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            store
        }
    });
});

export const getStore = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const store = await Store.findById(req.params.id);

    if (!store) {
        return next(new AppError('Store not found with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            store
        }
    });

});

export const updateStore = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!store) {
        return next(new AppError('Store not found with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            store
        }
    });
});

export const deleteStore = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const store = await Store.findByIdAndDelete(req.params.id);

    if (!store) {
        return next(new AppError('Store not found with that ID.', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

export const getStoresNearBy = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {cep} = req.params;

    const coordinates = await calculateCoordinates(cep);

    const stores = await Store.find({
        location: {
            $nearSphere: {
                $geometry: {
                    type: 'Point',
                    coordinates: coordinates,
                },
                $maxDistance: 100000
            }
        }
    });

    if (stores.length === 0) {
        res.status(200).json({
            status: 'success',
            message: 'No stores found near this location.'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            stores
        }
    });
});