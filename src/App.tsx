import { ThemeProvider } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import theme from './components/config/theme';
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
            <Route path="chat" element={<div>Chat</div>} />
            <Route path="pong" element={<div>Pong</div>} />
            <Route path="settings" element={<div>Settings</div>} />
            <Route path="404" element={<div>404 Not found</div>} />
            <Route path="500" element={<div>500 Internal server error</div>} />
            <Route path="*" element={<Navigate to="/404"/>} />
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
