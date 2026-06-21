import type {UtilisateurDto} from "../../auth/types";

export interface FamilleDto {
    nomFamille: string;
    uuid: string;
    utilisateurs: UtilisateurDto[]
}

export interface CreationFamilleDto {
    nomFamille: string;
}

export interface rejoindreFamilleDto {
    familleUuid: string;
}