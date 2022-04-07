import * as React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import TabPanel from './TabPanel';
import FollowerList from '../model/FollowerList';
import GameResult from '../model/GameResult';

const UserTab = () => {
  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Followings" sx={{ display: { sm: 'none' }}} />
        <Tab label="Ranking" />
        <Tab label="Match" />
        <Tab label="Level" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <FollowerList followers={[]} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GameResult />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography>Match</Typography>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography>Level</Typography>
      </TabPanel>
    </Box>
  );
};

export default UserTab;
