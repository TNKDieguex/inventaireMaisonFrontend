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
    if (familleUuid) {
        const cacheKey = `produits_famille_${familleUuid}`;
        const cacheExistante = sessionStorage.getItem(cacheKey);
        if (cacheExistante) {
            try {
                const cacheContainer = JSON.parse(cacheExistante);
                if (cacheContainer && Array.isArray(cacheContainer.data)) {
                    const nouveauProduit = Array.isArray(response.data) ? response.data : [response.data];
                    cacheContainer.data = [...cacheContainer.data, ...nouveauProduit];
                    cacheContainer.timestamp = Date.now();
                    sessionStorage.setItem(cacheKey, JSON.stringify(cacheContainer));
                } else {
                    const nouveauProduits = Array.isArray(response.data) ? response.data : [response.data];
                    sessionStorage.setItem(cacheKey, JSON.stringify({ data: nouveauProduits, timestamp: Date.now() }));
                }
            } catch (error) {
                console.error("Error al actualizar el contenedor de caché:", error);
                const nouveauProduits = Array.isArray(response.data) ? response.data : [response.data];
                sessionStorage.setItem(cacheKey, JSON.stringify({ data: nouveauProduits, timestamp: Date.now() }));
            }
        } else {
            const nouveauProduits = Array.isArray(response.data) ? response.data : [response.data];
            sessionStorage.setItem(cacheKey, JSON.stringify({ data: nouveauProduits, timestamp: Date.now() }));
        }
    }
    return response.data;
};