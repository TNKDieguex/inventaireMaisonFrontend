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