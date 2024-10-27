import {Client} from '@googlemaps/google-maps-services-js';

const client = new Client({});

export const getCoordinates = async (address: string) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        throw new Error('Chave de API do Google Maps não configurada.');
    }

    try {
        const response = await client.geocode({
            params: {
                address: address,
                region: 'br',
                key: apiKey,
            },
        });

        const {lat, lng} = response.data.results[0].geometry.location;

        return {
            latitude: lat,
            longitude: lng,
        };
    } catch (error) {
        throw new Error('Não foi possível obter as coordenadas.');
    }
}