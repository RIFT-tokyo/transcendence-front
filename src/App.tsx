import { ThemeProvider } from '@mui/material';
import theme from './components/config/theme';
import UserProfile from './components/pages/UserProfile';
import AppBarWithMenu from './components/ui/AppBarWithMenu';

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <AppBarWithMenu />
        <UserProfile />
      </ThemeProvider>
    </div>
  );
}

export default App;
