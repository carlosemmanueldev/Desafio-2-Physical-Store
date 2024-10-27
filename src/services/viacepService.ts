import axios from 'axios';

interface ViaCepResponse {
    "cep": string,
    "logradouro": string,
    "complemento": string,
    "unidade": string,
    "bairro": string,
    "localidade": string,
    "uf": string,
    "estado": string,
    "regiao": string,
    "ibge": string,
    "gia": string,
    "ddd": string,
    "siafi": string
}

export const getAddressByCep = async (cep: string) => {
    try {
        const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}