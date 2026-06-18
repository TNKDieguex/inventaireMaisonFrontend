export interface LoginRequestDto{
    courriel: string;
    motPasse: string;
}
export interface CreationUtilisateur {
    nom: string;
    courriel: string;
    motPasse: string;
    motPasseConfirmation: string;
}
export interface UtilisateurData {
    nom: string;
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
export interface ErreurResponseDto {
    message: string;
    timeStamp: string;
    status: number;
}