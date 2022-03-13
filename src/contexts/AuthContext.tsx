import React, { FC, useEffect, useMemo, useState } from 'react';
import { User, UserApi } from '../api/generated/api';

interface IAuthContext {
  currentUser: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const defaultState = {
  currentUser: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
};

export const AuthContext = React.createContext<IAuthContext>(defaultState);

export const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const userApi = new UserApi();

  const fetchMe = async () => {
    const owner = await userApi
      .getMe({ withCredentials: true })
      .then((res) => res.data)
      .catch(() => null);
    return owner;
  };

  const login = async () => {
    const owner = await fetchMe();
    setCurrentUser(owner);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  useEffect(() => {
    (async () => {
      await login();
    })();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memo = useMemo(() => ({ currentUser, isLoading, login, logout }), [currentUser, isLoading]);

  return <AuthContext.Provider value={memo}>{children}</AuthContext.Provider>;
};
