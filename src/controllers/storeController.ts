import Store from './../models/storeModel';
import catchAsync from './../utils/catchAsync';
import {NextFunction, Request, Response} from 'express';
import {calculateCoordinates} from "../utils/location";
import AppError from "../utils/appError";
import ApiFeatures from "../utils/apiFeatures";

export const getStores = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const features = await new ApiFeatures(Store.find(), req.query)
        .paginate();
    const stores = await features.query;

    res.status(200).json({
        status: 'success',
        results: stores.length,
        page: features.currentPage,
        totalPages: features.totalPages,
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
    const {coordinates} = await calculateCoordinates(cep);

    const query = Store.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates:[coordinates[0], coordinates[1]],
                },
                distanceField: 'distance',
                maxDistance: 100000,
                spherical: true,
            },
        },
        {
            $addFields: {
                distance: { $divide: ["$distance", 1000] }
            }
        },
        {
            $addFields: {
                distance: { $concat: [{ $toString: { $round: ["$distance", 3] } }, "km"] }
            }
        },
        {
            $project: {
                _id: 0,
                name: 1,
                cep: 1,
                number: 1,
                street: 1,
                neighborhood: 1,
                city: 1,
                uf: 1,
                state: 1,
                region: 1,
                coordinates: {
                    lat: {$arrayElemAt: ["$location.coordinates", 1]},
                    lon: {$arrayElemAt: ["$location.coordinates", 0]}
                },
                distance: 1
            }
        },
    ]);

    const features = await new ApiFeatures(query, req.query)
        .paginate();

    const stores = await features.query;

    if (stores.length === 0) {
        res.status(200).json({
            status: 'success',
            message: 'No stores found near this location.'
        });
    }

    res.status(200).json({
        status: 'success',
        results: stores.length,
        page: features.currentPage,
        totalPages: features.totalPages,
        data: {
            stores
        }
    });
});