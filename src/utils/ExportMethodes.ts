export const calculerJoursRestants = (dateLimite: string): number => {
    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);
    const [year, month, day] = dateLimite.split('-').map(Number);
    const dateDExpiration = new Date(year, month - 1, day);
    const differenceMs = dateDExpiration.getTime() - aujourdHui.getTime();
    return Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
};