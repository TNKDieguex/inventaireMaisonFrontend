export interface LoginRequestDto{
    courriel: string;
    motPasse: string;
}
export interface AuthResponseDto {
    token: string;
    utilisateur: UtilisateurDto;
}
export interface UtilisateurDto{
    nom: string;
    courriel: string;
    motPasse: string;
    uuid: string;
}