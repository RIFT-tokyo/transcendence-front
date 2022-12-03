import React, { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserApi } from '../api/generated/api';
import { TWO_FA_URL } from '../components/config/constants';

interface IAuthContext {
  authUser: User | null;
  isLoading: boolean;
  login: () => Promise<boolean>;
  logout: () => void;
  setAuthUser: (user: User | null) => void;
}

const defaultState = {
  authUser: null,
  isLoading: true,
  login: () => new Promise<boolean>(() => {}),
  logout: () => {},
  setAuthUser: () => {},
};

export const AuthContext = React.createContext<IAuthContext>(defaultState);

export const AuthProvider: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
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
    setLoading(true);
    const owner = await fetchMe();
    setAuthUser(owner);
    setLoading(false);
    return !!owner;
  };

  const logout = () => {
    setAuthUser(null);
  };

  useEffect(() => {
    (async () => {
      await login();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memo = useMemo(
    () => ({ authUser, isLoading, login, logout, setAuthUser }),
    [authUser, isLoading],
  );

  return <AuthContext.Provider value={memo}>{children}</AuthContext.Provider>;
};
