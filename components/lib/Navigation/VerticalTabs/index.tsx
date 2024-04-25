import React, { ReactElement, useState } from 'react';

import { Box, Divider, Grid, Paper, Typography, Theme } from '@mui/material';

import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';

import TabPanel from '../Tabs/TabPanel';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface Label {
  label: string;
  count?: number;
}

interface VerticalTabsProps {
  labels: Label[];
  panels: ReactElement[];
  isIconPresent?: boolean;
  isCountPresent?: boolean;
}

const styles = {
  btn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem 1rem 1.5rem',
    cursor: 'pointer',
  },
  expandCircle: {
    transform: 'rotate(270deg)',
    fontSize: '1.25rem',
    color: 'primary.main',
  },
  selectedPanelText: {
    height: '1.5rem',
    paddingLeft: '0.625rem',
    borderLeft: (theme: Theme) => `4px solid ${theme.palette?.primary.main}`,
    color: 'primary.main',
  },
  panelText: {
    height: '1.5rem',
    paddingLeft: '0.625rem',
    marginLeft: '4px',
  },
  icon: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: {
    height: '1.5rem',
    width: '1.5rem',
    borderRadius: '50%',
    background: (theme: Theme) => theme.palette?.white.light,
    textAlign: 'center',
    fontSize: '0.85rem',
  },
  selectedCount: {
    height: '1.5rem',
    width: '1.5rem',
    borderRadius: '50%',
    background: (theme: Theme) => theme.palette?.primary.main,
    color: 'common.white',
    textAlign: 'center',
    fontSize: '0.85rem',
  },
  countText: {
    fontSize: '0.85rem',
    lineHeight: 1.85,
  },
  labelText: {
    lineHeight: 1.5,
  },
};

export default function VerticalTabs(props: VerticalTabsProps) {
  const [selectedPanel, setSelectedPanel] = useState(0);

  const { panels = [], labels = [], isIconPresent = true, isCountPresent = false } = props;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 4, md: 4 }}>
        <Grid item xl={3} lg={3} md={4} xs={12}>
          <Paper elevation={0} square={true}>
            {labels.map(({ label, count }, index) => (
              <React.Fragment key={`labelList${index}`}>
                <Box sx={styles.btn} onClick={() => setSelectedPanel(index)}>
                  <Box sx={selectedPanel == index ? styles.selectedPanelText : styles.panelText}>
                    <Typography sx={styles.labelText}>{label}</Typography>
                  </Box>

                  {!isCountPresent && isIconPresent && selectedPanel == index && (
                    <Box sx={styles.icon}>
                      <ExpandCircleDownOutlinedIcon sx={styles.expandCircle} />
                    </Box>
                  )}

                  {isCountPresent && (
                    <Box sx={selectedPanel == index ? styles.selectedCount : styles.count}>
                      <Typography sx={styles.countText}>{zeroPad(count)}</Typography>
                    </Box>
                  )}
                </Box>

                {labels.length - 1 !== index && <Divider />}
              </React.Fragment>
            ))}
          </Paper>
        </Grid>

        <Grid item xl={9} lg={9} md={8} xs={12}>
          {panels?.map((panel, index: number) => (
            <TabPanel value={selectedPanel} index={index} key={`TabPanelComponent${index}`}>
              {panel}
            </TabPanel>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

const zeroPad = (n?: number): string => {
  const num = n && typeof n === 'string' ? parseInt(n, 10) : n || 0;
  return num > 9 ? '' + num : '0' + num;
};
