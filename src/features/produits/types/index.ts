export const CategorieProduit = {
    LAITIER: "LAITIER",
    FRUIT_ET_LEGUME: "FRUIT_ET_LEGUME",
    VIANDE: "VIANDE",
    BOISSONS: "BOISSONS",
    EPICES: "EPICES",
    SURGELES: "SURGELES",
    SNACKS: "SNACKS",
    NETTOYAGE: "NETTOYAGE",
    AUTRES: "AUTRES"
}as const;
export type CategorieProduitType = typeof CategorieProduit[keyof typeof CategorieProduit];

export interface ProduitDto {
    nom: string;
    quantite: number;
    quantiteMinimal: number;
    dateLimiteConsommation: string;
    categorieProduit: CategorieProduitType;
    notes?: string;
    uuid : string;
}
export interface UpdateProduitDto {
    quantite: number;
    quantiteMinimal: number;
    dateLimiteConsommation: string;
    notes: string;
    uuid: string;
}