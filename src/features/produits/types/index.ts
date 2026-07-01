export const CategorieProduit = {
    FRUIT_ET_LEGUMES: "FRUIT_ET_LEGUMES",
    LAITIER_ET_OEUFS: "LAITIER_ET_OEUFS",
    GARDE_MANGER: "GARDE_MANGER",
    VIANDE: "VIANDE",
    POISSON_ET_FRUITS_DE_MER: "POISSON_ET_FRUITS_DE_MER",
    BOISSONS: "BOISSONS",
    SNACKS: "SNACKS",
    SAUCES_ET_CONDIMENTS: "SAUCES_ET_CONDIMENTS",
    ENTRETIEN_MENAGER_ET_NETTOYAGE: "ENTRETIEN_MENAGER_ET_NETTOYAGE",
    SOINS_ET_BEAUTE: "SOINS_ET_BEAUTE",
    ESSENTIELS_POUR_ANIMAUX: "ESSENTIELS_POUR_ANIMAUX",
    SURGELES: "SURGELES",
    BIOLOGIQUE: "BIOLOGIQUE",
    PAIN_ET_PATISSERIES: "PAIN_ET_PATISSERIES",
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

export interface CreateProduitDto {
    nom: string;
    quantite: number;
    quantiteMinimal: number;
    dateLimiteConsommation: string;
    categorieProduit: CategorieProduitType;
    notes?: string;
}

export interface UpdateProduitDto {
    quantite: number;
    quantiteMinimal: number;
    dateLimiteConsommation: string;
    notes: string;
    uuid: string;
}

export interface UpdateQuantiteProduitDto{
    quantite: number;
}

export interface UpdateNoteProduitDto{
    notes: string;
}
export type ManualItem = {
    nom: string;
    quantite: number;
    id: string;
    manual: true;
};
export type ShoppingListItem = (ProduitDto | ManualItem) & { id: string };