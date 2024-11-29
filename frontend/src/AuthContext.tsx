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
}

const AuthContext = createContext<{ token: string | null; user: any | null; setUser: (newUser: any) => void } | null>(null);


const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [user, setUser_] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {});
  const setUser = (newUser: any) => {
    setToken_(newUser.token);
    setUser_(newUser.user);
    localStorage.setItem("token", newUser.token);
    localStorage.setItem("user", JSON.stringify(newUser.user));
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token',token);
    } else {
      localStorage.removeItem('token')
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      user,
      setUser,
    }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;