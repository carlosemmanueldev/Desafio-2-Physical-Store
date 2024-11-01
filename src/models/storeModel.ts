import {Schema, model} from 'mongoose';
import {calculateCoordinates} from "../utils/location";

interface Store {
    name: string;
    cep: string;
    number: string;
    street: string;
    complement: string;
    neighborhood: string;
    city: string;
    uf: string;
    state: string;
    region: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
}

const storeSchema = new Schema<Store>(
    {
        name: {type: String, required: [true, 'A store must have a name.'], unique: true},
        cep: {type: String, required: [true, 'A store must have a cep.']},
        number: {type: String, required: [true, 'A store must have a number.']},
        street: {type: String},
        complement: {type: String},
        neighborhood: {type: String},
        city: {type: String},
        uf: {type: String},
        state: {type: String},
        region: {type: String},
        location: {
            type: {type: String, default: 'Point', enum: ['Point']},
            coordinates: {type: [Number]},
        },
    },
    {
        timestamps: true
    }
);

storeSchema.set('toJSON', {
    transform: (doc, ret) => {
        return {
            id: ret._id,
            name: ret.name,
            cep: ret.cep,
            number: ret.number,
            street: ret.street,
            neighborhood: ret.neighborhood,
            city: ret.city,
            uf: ret.uf,
            state: ret.state,
            region: ret.region,
            coordinates: {
                lat: ret.location.coordinates[1],
                lon: ret.location.coordinates[0]
            },
        };
    }
});

storeSchema.index({ cep: 1, number: 1 }, { unique: true });
storeSchema.index({location: '2dsphere'});

storeSchema.pre('save', async function (next) {
    const address = await calculateCoordinates(this.cep);

    this.street = address.street;
    this.neighborhood = address.neighborhood;
    this.city = address.city;
    this.uf = address.uf;
    this.state = address.state;
    this.region = address.region;
    this.location = {
        type: 'Point',
        coordinates: [address.coordinates[1], address.coordinates[0]]
    };

    next();
});

storeSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate() as Record<string, any>;
    const fieldsToCheck = ['cep', 'street', 'neighborhood', 'city', 'uf', 'state', 'region', 'location'];
    const shouldRecalculate = fieldsToCheck.some((field) => field in update);

    if (shouldRecalculate) {
        const doc = await this.model.findOne(this.getQuery());
        const cep: string = update.cep || doc.cep;

        const address = await calculateCoordinates(cep);

        this.set({
            street: address.street,
            neighborhood: address.neighborhood,
            city: address.city,
            uf: address.uf,
            state: address.state,
            region: address.region,
            location: {
                type: 'Point',
                coordinates: address.coordinates
            }
        });
    }

    next();
});

const Store = model('Store', storeSchema);

export default Store;