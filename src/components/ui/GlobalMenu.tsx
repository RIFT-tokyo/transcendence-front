import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalMenuItems from '../config/global-menu';

type Props = {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const DRAWER_WIDTH = 240;

const GlobalMenu: React.VFC<Props> = ({ open, onClose }: Props) => {
  const navigate = useNavigate();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Box
        sx={{
          overflow: 'auto',
          pt: 7,
        }}
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        <List>
          {GlobalMenuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.to)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}


export default GlobalMenu;