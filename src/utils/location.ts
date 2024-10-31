import {getCoordinates} from "../services/googleMapsService";
import {getAddressByCep} from "../services/viacepService";
import AppError from "./appError";

export const calculateCoordinates = async (cep: string) => {
    const addressData = await getAddressByCep(cep);

    if (!addressData) {
        throw new AppError('Zip code does not exist.', 404);
    }

    const {logradouro, bairro, localidade, uf, estado, regiao} = addressData;
    const address = `${logradouro}, ${bairro}, ${localidade}, ${estado}`;

    const coordinates = await getCoordinates(address);

    if (!coordinates) {
        throw new AppError('Address not found.', 404);
    }

    return {
        street: logradouro,
        neighborhood: bairro,
        city: localidade,
        uf: uf,
        state: estado,
        region: regiao,
        coordinates: [coordinates.longitude, coordinates.latitude]
    }
}