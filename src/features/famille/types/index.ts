import type {UtilisateurDto} from "../../auth/types";

export interface FamilleDto {
    nomFamille: string;
    uuid: string;
    utilisateurs: UtilisateurDto[]
}