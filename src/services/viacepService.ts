import axios from 'axios';
import AppError from "../utils/appError";

interface ViaCepResponse {
    cep: string,
    logradouro: string,
    complemento: string,
    unidade: string,
    bairro: string,
    localidade: string,
    uf: string,
    estado: string,
    regiao: string,
    ibge: string,
    gia: string,
    ddd: string,
    siafi: string
    erro?: boolean
}

export const getAddressByCep = async (cep: string) => {
    try {
        const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`);

        if (response.data.erro) {
            return null;
        }

        return response.data;
    } catch (error) {
        throw new AppError('Invalid zip code format. Please check the zip code provided.', 400);
    }
}