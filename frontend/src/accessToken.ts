let accessToken = "";
export const setAccessToken = (s: string) => {
    accessToken = s;
    //localStorage.setItem("accessToken", s);
};

export const getAccessToken = (): string => {
    return accessToken;
    //return localStorage.getItem("accessToken") || "";
};
