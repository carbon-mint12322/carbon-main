import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import HistoryView from './HistoryView';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export function TabsContainer(props: any) {
  const [value, setValue] = React.useState(0);
  const router = useRouter();
  const pagePath = router.asPath;
  let index = 0;
  const { makeStateArr, wf, stateLabel } = props;
  const TabsAny: any = Tabs;
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const stateName = wf?.state?.name || 'start';

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabsAny value={value} onChange={handleChange} aria-label='onboarding details'>
          {stateName !== 'validated' && <Tab label={props.editLabel} {...a11yProps(0)} />}
          {stateName != 'start' && <Tab label='History' {...a11yProps(1)} />}
        </TabsAny>
      </Box>
      {stateName !== 'validated' && (
        <TabPanel value={value} index={index++}>
          {props.children}
        </TabPanel>
      )}
      {stateName != 'start' && (
        <TabPanel value={value} index={index++}>
          <HistoryView
            wf={wf}
            makeStateArr={makeStateArr}
            stateLabel={stateLabel}
            domainObjectId={props.domainObjectId}
          />
        </TabPanel>
      )}
    </Box>
  );
}
