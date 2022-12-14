import * as React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import MatchHistory from './MatchHistory';

interface TabPanelProps {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`game-result-tabpanel-${index}`}
      aria-labelledby={`game-result-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && (
        <Box component="div" p={3}>
          {children}
        </Box>
      )}
    </div>
  );
};

const GameResult = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box component="div">
      <Tabs value={value} onChange={handleChange} aria-label="game result tabs">
        <Tab
          label="match"
          id="game-result-0"
          aria-controls="game-result-tabpanel-0"
        />
        {/* <Tab
          label="ranking"
          id="game-result-1"
          aria-controls="game-result-tabpanel-1"
        />
        <Tab
          label="level"
          id="game-result-2"
          aria-controls="game-result-tabpanel-2"
        /> */}
      </Tabs>
      <TabPanel value={value} index={0}>
        <MatchHistory />
      </TabPanel>
      {/* <TabPanel value={value} index={1}>
        ranking
      </TabPanel>
      <TabPanel value={value} index={2}>
        level
      </TabPanel> */}
    </Box>
  );
};
export default GameResult;
