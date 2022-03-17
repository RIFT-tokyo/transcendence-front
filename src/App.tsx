import { ThemeProvider } from '@mui/material';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import theme from './components/config/theme';
import Chat from './components/pages/Chat';
import InternalServerError from './components/pages/InternalServerError';
import NotFound from './components/pages/NotFound';
import Pong from './components/pages/Pong';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';
import Settings from './components/pages/Settings';
import UserProfile from './components/pages/UserProfile';
import AppBarWithMenu from './components/ui/AppBarWithMenu';
import { AuthContext } from './contexts/AuthContext';

const PrivateRoute = () => {
  const { authUser } = useContext(AuthContext);

  return authUser ? <Outlet /> : <Navigate to="signin" />;
};

const App = () => {
  const { isLoading } = useContext(AuthContext);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        {isLoading ? null : (
          <Routes>
            <Route path="/" element={<AppBarWithMenu />}>
              <Route path="" element={<PrivateRoute />}>
                <Route path="home" element={<UserProfile />} />
                <Route path="users">
                  <Route path=":username" element={<UserProfile />} />
                </Route>
                <Route path="chat" element={<Chat />} />
                <Route path="pong" element={<Pong />} />
                <Route path="settings">
                  <Route index element={<Navigate to="account" replace />} />
                  <Route
                    path="account"
                    element={<Settings active="Account" />}
                  />
                  <Route
                    path="security"
                    element={<Settings active="Security" />}
                  />
                </Route>
              </Route>

              <Route index element={<SignUp />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="404" element={<NotFound />} />
              <Route path="500" element={<InternalServerError />} />
              <Route path="*" element={<Navigate to="404" />} />
            </Route>
          </Routes>
        )}
      </ThemeProvider>
    </div>
  );
};

export default App;
