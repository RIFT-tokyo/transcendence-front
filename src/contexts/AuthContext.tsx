import React, { FC, useState } from 'react';

export const AuthContext = React.createContext<any>(null);

export const AuthProvider: FC = ({ children }) => {
  // User is the name of the "data" that gets stored in context
  const [user, setUser] = useState({ name: '', auth: true });

  // Login updates the user data with a name parameter
  const login = (name: string) => {
    setUser((user) => ({
      name,
      auth: true,
    }));
  };

  // Logout updates the user data to default
  const logout = () => {
    setUser((user) => ({
      name: '',
      auth: false,
    }));
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
