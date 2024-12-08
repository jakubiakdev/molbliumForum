import { createContext, useContext, useMemo, ReactNode, useState, useEffect } from "react";

// export const UserContext = createContext({
//     user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
//     setUser: (user: any) => {} // TODO: Logging in should be handled here
// });
// TODO: change user to a defined type
interface User {
    id: number;
    username: string;
    displayName: string;
    registerDate: string;
}

const AuthContext = createContext<{ getToken: () => string | null; user: User | null; setUser: (newUser: { token: string; user: User; tokenExpiry: number }) => void; logout: () => void } | null>(null);


const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [user, setUser_] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {});
    const [expires, setExpires_] = useState(Number(localStorage.getItem("expires")) || 0);
    const setUser = (newUser: any) => {
        setToken_(newUser.token);
        setUser_(newUser.user);
        setExpires_(newUser.tokenExpiry);
        localStorage.setItem("token", newUser.token);
        localStorage.setItem("user", JSON.stringify(newUser.user));
        localStorage.setItem("expires", newUser.tokenExpiry);
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token')
        }
    }, [token]);

    const contextValue = useMemo(
        () => ({
            getToken: (): string | null => {
                if (Date.now() > expires) {
                    return null;
                }
                return token;
            },
            user,
            setUser,
            logout: () => {
                setToken_(null);
                setUser_(null);
                setExpires_(0);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('expires');
            }
        }),
        [expires, token, user]
    );

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;