import {Schema, model} from 'mongoose';

const storeSchema = new Schema(
    {
        name: {type: String, required: true},
        cep: {type: String, required: true},
        street: {type: String, required: true},
        complement: {type: String, required: true},
        neighborhood: {type: String, required: true},
        city: {type: String, required: true},
        uf: {type: String, required: true},
        state: {type: String, required: true},
        region: {type: String, required: true},
    },
    {
        timestamps: true
    }
);

const Store = model('Store', storeSchema);

export default Store;