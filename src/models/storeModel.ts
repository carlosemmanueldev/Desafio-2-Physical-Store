import {Schema, model} from 'mongoose';
import {calculateCoordinates} from "../utils/location";

const storeSchema = new Schema(
    {
        name: {type: String, required: true},
        cep: {type: String, required: true},
        street: {type: String, required: true},
        complement: {type: String},
        neighborhood: {type: String, required: true},
        city: {type: String, required: true},
        uf: {type: String, required: true},
        state: {type: String, required: true},
        region: {type: String, required: true},
        location: {
            type: {type: String, default: 'Point', enum: ['Point']},
            coordinates: [Number]
        },
    },
    {
        timestamps: true
    }
);

storeSchema.index({location: '2dsphere'});

storeSchema.pre('save', async function (next) {
    const coordinates = await calculateCoordinates(this.cep);

    this.location = {
        type: 'Point',
        coordinates
    };
    next();
});

const Store = model('Store', storeSchema);

export default Store;