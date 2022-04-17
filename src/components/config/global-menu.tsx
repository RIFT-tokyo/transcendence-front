import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { CHAT_URL, GAME_URL, HOME_URL, SETTING_URL } from './constants';

const GlobalMenuItems = [
  {
    icon: <HomeIcon />,
    text: 'Home',
    to: HOME_URL,
  },
  {
    icon: <ChatIcon />,
    text: 'Chat',
    to: CHAT_URL,
  },
  {
    icon: <SportsEsportsIcon />,
    text: 'Games',
    to: GAME_URL,
  },
  {
    icon: <SettingsIcon />,
    text: 'Setting',
    to: SETTING_URL,
  },
];

export default GlobalMenuItems;
