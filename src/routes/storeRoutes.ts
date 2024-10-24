import express from "express";
import {createStore, deleteStore, getStore, getStores, updateStore} from "../controllers/storeController";

const storeRouter = express.Router();

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