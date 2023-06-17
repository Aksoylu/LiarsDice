export const getLang = () => {
    return localStorage.getItem('user_lang') ?? "en";
}

export const getUsername = () => {
    return localStorage.getItem('username') ?? null;
}