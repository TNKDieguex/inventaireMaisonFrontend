import type {ProduitDto} from "../features/produits/types";
import type {FamilleDto} from "../features/famille/types";
import axiosClient from "../api/axiosClient.ts";

export const getFamilleIdFromToken = (token: string | null): string | null => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const payload = JSON.parse(window.atob(base64));
        return payload.familleUuid || null;
    } catch (error) {
        console.error("Error al decodificar el JWT:", error);
        return null;
    }
};
export const getValidCachedProduits = (familleUuid: string | null): ProduitDto[] | undefined => {
    if (!familleUuid) return undefined;
    const cachedRaw = sessionStorage.getItem(`produits_famille_${familleUuid}`);
    if (!cachedRaw) return undefined;
    try {
        const cached = JSON.parse(cachedRaw) as { data: ProduitDto[]; timestamp: number };
        const DEUX_HEURES = 2 * 60 * 60 * 1000;
        if (Date.now() - cached.timestamp <= DEUX_HEURES) {
            return cached.data;
        }
    } catch {
        sessionStorage.removeItem(`produits_famille_${familleUuid}`);
        return undefined;
    }
    sessionStorage.removeItem(`produits_famille_${familleUuid}`);
    return undefined;
};
export const getValidCachedFamille = (familleUuid: string | null): FamilleDto | undefined => {
    if (!familleUuid) return undefined;

    const cachedRaw = sessionStorage.getItem(`famille_info_${familleUuid}`);
    if (!cachedRaw) return undefined;

    try {
        const cached = JSON.parse(cachedRaw) as { data: FamilleDto; timestamp: number };
        const DEUX_HEURES = 2 * 60 * 60 * 1000;

        if (Date.now() - cached.timestamp <= DEUX_HEURES) {
            return cached.data;
        }
    } catch {
        sessionStorage.removeItem(`famille_info_${familleUuid}`);
        return undefined;
    }
    sessionStorage.removeItem(`famille_info_${familleUuid}`);
    return undefined;
};
export const fetchFamilleAndPutCache = async (familleUuid: string | null) : Promise<FamilleDto> =>{
    const response = await axiosClient.get<FamilleDto>('/utilisateurs/familles/info');
    const cacheContainer = {
        data: response.data,
        timestamp: Date.now()
    };
    sessionStorage.setItem(`famille_info_${familleUuid}`, JSON.stringify(cacheContainer));
    return response.data;
}