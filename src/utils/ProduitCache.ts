import axiosClient from "../api/axiosClient";
import type {ProduitDto, UpdateProduitDto} from "../features/produits/types";

export const fetchAndCacheProduits = async (familleUuid: string): Promise<ProduitDto[]> => {
    const response = await axiosClient.get<ProduitDto[]>('/produits');
    const cacheContainer = {
        data: response.data,
        timestamp: Date.now()
    };
    sessionStorage.setItem(`produits_famille_${familleUuid}`, JSON.stringify(cacheContainer));
    return response.data;
};

export const deleteProduit = async (produitUuid: string, familleUuid: string|null, listeProduits: ProduitDto[]): Promise<ProduitDto[]> => {
    const response = await axiosClient.delete<ProduitDto>(`/produits/${produitUuid}`);
    const listeModifie = listeProduits.filter(p => p.uuid !== response.data.uuid);
    sessionStorage.setItem(`produits_famille_${familleUuid}`, JSON.stringify({
        data: listeModifie,
        timestamp: Date.now()
    }));
    return listeModifie;
};

export const updateProduit = async (familleUuid: string|null, listeProduits: ProduitDto[], produitAModifier: UpdateProduitDto): Promise<ProduitDto[]> => {
    const response = await axiosClient.put<ProduitDto>('/produits/modifierProduit', produitAModifier);
    const listeModifie = listeProduits.map(p =>
        p.uuid === response.data.uuid ? response.data : p
    );
    sessionStorage.setItem(`produits_famille_${familleUuid}`, JSON.stringify({
        data: listeModifie,
        timestamp: Date.now()
    }));
    return listeModifie;
};