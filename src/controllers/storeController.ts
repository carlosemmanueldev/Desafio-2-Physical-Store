import Store from './../models/storeModel';
import {Request, Response} from 'express';
import {calculateCoordinates} from "../utils/location";

export const getStores = async (req: Request, res: Response) => {
    try {
        const stores = await Store.find();
        res.status(200).json({
            status: 'success',
            results: stores.length,
            data: {
                stores
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
}

export const createStore = async (req: Request, res: Response) => {
    try {
        const store = await Store.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                store
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
};

export const getStore = async (req: Request, res: Response) => {
    try {
        const store = await Store.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                store
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

export const updateStore = async (req: Request, res: Response) => {
    try {
        const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                store
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

export const deleteStore = async (req: Request, res: Response) => {
    try {
        await Store.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

export const getStoresNearBy = async (req: Request, res: Response) => {
    try {
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

        res.status(200).json({
            status: 'success',
            data: {
                stores
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}