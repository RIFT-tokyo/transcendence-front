import { ThemeProvider } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import theme from './components/config/theme';
import Chat from './components/pages/Chat';
import InternalServerError from './components/pages/InternalServerError';
import NotFound from './components/pages/NotFound';
import Pong from './components/pages/Pong';
import Settings from './components/pages/Settings';
import UserProfile from './components/pages/UserProfile';
import AppBarWithMenu from './components/ui/AppBarWithMenu';

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<AppBarWithMenu/>} >
            <Route index element={<Navigate to="/home"/>} />
            <Route path="home" element={<UserProfile/>} />
            <Route path="users">
              <Route path=":username" element={<UserProfile/>} />
            </Route>
            <Route path="chat" element={<Chat/>} />
            <Route path="pong" element={<Pong/>} />
            <Route path="settings">
              <Route index element={<Navigate to="account"/>} />
              <Route path="account" element={<Settings active="Account"/>} />
              <Route path="security" element={<Settings active="Security"/>} />
            </Route>
            <Route path="404" element={<NotFound/>} />
            <Route path="500" element={<InternalServerError/>} />
            <Route path="*" element={<Navigate to="404"/>} />
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
