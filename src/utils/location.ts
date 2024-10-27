import {getCoordinates} from "../services/googleMapsService";
import {getAddressByCep} from "../services/viacepService";

export const calculateCoordinates = async (cep: string) => {
    const addressData = await getAddressByCep(cep);

    if (!addressData) {
        throw new Error('Endereço não encontrado.');
    }

    const {logradouro, bairro, localidade, estado} = addressData;
    const address = `${logradouro}, ${bairro}, ${localidade}, ${estado}`;

    const coordinates = await getCoordinates(address);

    if (!coordinates) {
        throw new Error('Coordenadas não encontradas.');
    }

    return [coordinates.longitude, coordinates.latitude];
}