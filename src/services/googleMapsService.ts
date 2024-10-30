import {Client} from '@googlemaps/google-maps-services-js';

const client = new Client({});

export const getCoordinates = async (address: string) => {
    try {
        const response = await client.geocode({
            params: {
                address: address,
                region: 'br',
                key: process.env.GOOGLE_MAPS_API_KEY!,
            },
        });

        const {lat, lng} = response.data.results[0].geometry.location;

        return {
            latitude: lat,
            longitude: lng,
        };
    } catch (error) {
        return null;
    }
}