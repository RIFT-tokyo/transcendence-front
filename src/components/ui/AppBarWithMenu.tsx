import { AppBar, Toolbar, IconButton, Typography, Box,  Menu, MenuItem, Link } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from '@mui/icons-material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthApi } from '../../api/generated/api';

const AppBarWithMenu = () => {
  const [auth] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  const logout = async () => {
    handleClose();
    await authApi
      .postAuthLogout({ withCredentials: true })
      .then(() => {
        goHome();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ft_transcendence
            </Typography>
            {auth && (
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
                  <MenuItem onClick={goHome}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={goToSettings}>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </div>
  )
}

export default AppBarWithMenu