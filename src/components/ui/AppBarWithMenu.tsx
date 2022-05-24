import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from '@mui/icons-material';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AuthApi } from '../../api/generated/api';
import { AuthContext } from '../../contexts/AuthContext';
import GlobalMenu from './GlobalMenu';
import {
  CONTENT_HEIGHT,
  CONTENT_WITH_FOOTER_HEIGHT,
  SETTING_URL,
} from '../config/constants';
import GlobalFooter from './GlobalFooter';
import { SocketContext } from '../../contexts/SocketContext';

const RequiredAuth = () => {
  const { client, connect } = React.useContext(SocketContext);
  const { authUser } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (authUser) {
      if (client === null) connect(authUser.id);
    }
  }, [authUser, client, connect]);

  return authUser ? <Outlet /> : <Navigate to="signup" />;
};

const AppBarWithMenu = () => {
  const { logout } = React.useContext(AuthContext);
  const { disconnect } = React.useContext(SocketContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const navigate = useNavigate();
  const authApi = new AuthApi();
  const { enqueueSnackbar } = useSnackbar();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goHome = () => {
    handleClose();
    navigate('/');
  };

  const goToSettings = () => {
    handleClose();
    navigate(SETTING_URL);
  };

  const logOut = async () => {
    handleClose();
    try {
      await authApi.postAuthLogout({ withCredentials: true });
      logout();
      disconnect();
      goHome();
    } catch (err: any) {
      enqueueSnackbar(err.response.data.message, { variant: 'error' });
    }
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setOpenDrawer(open);
    };

  return (
    <div>
      <AppBar>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(!openDrawer)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            onClick={goHome}
            sx={{
              flexGrow: 1,
              fontFamily: 'Zen Tokyo Zoo',
              cursor: 'pointer',
            }}
          >
            TRANSCENDENCE
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={goHome}>Profile</MenuItem>
              <MenuItem onClick={goToSettings}>Settings</MenuItem>
              <MenuItem onClick={logOut}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <GlobalMenu open={openDrawer} onClose={toggleDrawer(false)} />
      <Box
        component="div"
        height={CONTENT_WITH_FOOTER_HEIGHT}
        sx={{ mt: 8, overflowY: 'auto' }}
      >
        <Box component="div" minHeight={CONTENT_HEIGHT}>
          <RequiredAuth />
        </Box>
        <GlobalFooter />
      </Box>
    </div>
  );
};

export default AppBarWithMenu;
