import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function CustomTabs(props: any) {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
          {props?.labelList?.map((label: any, index: number) => (
            <Tab label={label} {...a11yProps(index)} key={`labelList${index}`} />
          ))}
        </Tabs>
        {props?.headerContent && props?.headerContent}
      </Box>
      {props?.componentList?.map((tab: any, index: number) => {
        const { component: Component, props } = tab;
        return (
          <TabPanel value={value} index={index} key={`TabPanelComponent${index}`}>
            <Component {...props} />
          </TabPanel>
        );
      })}
    </Box>
  );
}
