import React, { useState, ElementType, SyntheticEvent, ReactNode, ReactElement } from 'react';

import MuiTabs from '@mui/material/Tabs';
import MuiTab, { TabProps } from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';

import TabPanel from './TabPanel';

export interface ComponentList {
  label: ReactNode;
  icon: ReactElement;
  count?: Number | undefined;
  component: ElementType;
  props?: {
    [key: string]: any;
  };
}

export interface CustomTabsProps {
  componentList?: ComponentList[];
  headerContent?: ReactNode;
  sx?: SxProps;
  getCurrentTab?: Function
}

export default function Tabs({
  headerContent,
  componentList,
  getCurrentTab,
  sx = {},
}: CustomTabsProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (getCurrentTab) {
      getCurrentTab(componentList ? componentList[newValue] : newValue)
    }
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ overflowX: 'auto', height: 48, maxWidth: 1100 }}>
          <MuiTabs value={value} onChange={handleChange} variant='scrollable' scrollButtons='auto'>
            {componentList?.map(({ label, count, icon }: ComponentList, index: number) => (
              <MuiTab
                label={count !== undefined ? `${label} (${count})` : label}
                key={`labelList${index}`}
                iconPosition='start'
                // {...props}
                icon={icon}
                {...a11yProps(index)}
              />
            ))}
          </MuiTabs>
        </Box>

        {headerContent && headerContent}
      </Box>

      {componentList?.map((tab: ComponentList, index: number) => {
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
