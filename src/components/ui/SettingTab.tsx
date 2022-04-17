import { Link, Stack, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import HelpIcon from '@mui/icons-material/Help';
import { NavLink } from 'react-router-dom';
import * as React from 'react';

type Props = {
  actions: string[];
};

const SettingTab: React.VFC<Props> = ({ actions }: Props) => {
  const getIcon = (action: string) => {
    switch (action) {
      case 'Account':
        return <PersonIcon />;
      case 'Security':
        return <KeyIcon />;
      default:
        return <HelpIcon />;
    }
  };
  const settings = actions.map((item) => {
    const link = `/settings/${item.toLowerCase()}`;
    return (
      <Link
        key={item.toLowerCase()}
        component={NavLink}
        color="inherit"
        underline="none"
        to={link}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {getIcon(item)}
          <Typography variant="h5">{item}</Typography>
        </Stack>
      </Link>
    );
  });

  return (
    <Stack padding={2} width={150} direction="column" spacing={1}>
      {settings}
    </Stack>
  );
};

export default SettingTab;
