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
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthApi } from '../../api/generated/api';
import { AuthContext } from '../../contexts/AuthContext';

const AppBarWithMenu = () => {
  const { logout } = React.useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const authApi = new AuthApi();

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
    navigate('/settings');
  };

  const logOut = async () => {
    handleClose();
    await authApi
      .postAuthLogout({ withCredentials: true })
      .then(() => {
        logout();
        goHome();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1, pt: 10 }}>
        <AppBar>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
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
      </Box>
      <Outlet />
    </div>
  );
};

export default AppBarWithMenu;
