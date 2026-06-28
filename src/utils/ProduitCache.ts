import axiosClient from "../api/axiosClient";
import type {CreateProduitDto, ProduitDto} from "../features/produits/types";

export const fetchAndCacheProduits = async (familleUuid: string): Promise<ProduitDto[]> => {
    const response = await axiosClient.get<ProduitDto[]>('/produits');
    const cacheContainer = {
        data: response.data,
        timestamp: Date.now()
    };
    sessionStorage.setItem(`produits_famille_${familleUuid}`, JSON.stringify(cacheContainer));
    return response.data;
};

export const creerProduits = async (familleUuid: string|null, listeProduits: CreateProduitDto[]): Promise<ProduitDto[]> => {
    const response = await axiosClient.post<ProduitDto[]>('/produits/creation', listeProduits);
    sessionStorage.setItem(`produits_famille_${familleUuid}`, JSON.stringify({
        data: response.data,
        timestamp: Date
        }));
    return response.data;
};