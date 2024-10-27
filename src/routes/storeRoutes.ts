import express from "express";
import {
    createStore,
    deleteStore,
    getStore,
    getStores,
    getStoresNearBy,
    updateStore
} from "../controllers/storeController";

const storeRouter = express.Router();

storeRouter
    .route("/stores-near-by/:cep")
    .get(getStoresNearBy);

storeRouter
    .route("/")
    .get(getStores)
    .post(createStore);

storeRouter
    .route("/:id")
    .get(getStore)
    .patch(updateStore)
    .delete(deleteStore);

export default storeRouter;