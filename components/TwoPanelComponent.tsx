import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import _ from 'lodash';
import React, { ReactElement, useState } from 'react';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';

interface LeftPanelItemProps {
  selected: Boolean;
  label: string;
  count?: number;
  onClick: () => void;
}

const ClickableGrid = styled(Grid)`
  :hover {
    cursor: pointer;
  }
`;

const LeftPanelItem = ({ selected, label, count, onClick }: LeftPanelItemProps) => {
  return (
    <ClickableGrid
      onClick={onClick}
      container
      item
      width='100%'
      justifyContent='space-between'
      flexWrap='nowrap'
    >
      <Grid container direction='row' position='relative' gap='20px'>
        {selected && (
          <Grid
            // position='absolute'
            // left='-20px'
            container
            height={20}
            width={4}
            borderRadius='15px'
            bgcolor='#F8870F'
          />
        )}
        <Typography color={selected ? '#F8870F' : '#333333'} fontSize={15} fontWeight={600}>
          {label}
        </Typography>
      </Grid>
      {!_.isNil(count) && (
        <Grid
          bgcolor={selected ? '#F8870F' : '#E5E5E5'}
          p={0.5}
          borderRadius='100%'
          minWidth='24px'
          width='fit-content'
          container
          justifyContent='center'
          alignItems='center'
          sx={{ aspectRatio: 1 }}
        >
          <Typography color={selected ? '#ffffff' : '#333333'} fontSize={12} fontWeight={550}>
            {count}
          </Typography>
        </Grid>
      )}
    </ClickableGrid>
  );
};

interface LeftLabel {
  label: string;
  count?: number;
}

interface IProps {
  labels: LeftLabel[];
  panels: ReactElement[];
}

const btnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px',
  cursor: 'pointer',
};

const intialBtnTextColors = {
  basicInfoTextColor: 'black',
  IdAndVerificationTextColor: 'black',
  farmingExperienceTextColor: 'black',
  landDetailsTextColor: 'black',
};

const expandCircleStyle = {
  transform: 'rotate(270deg)',
  fontSize: '16px',
  color: '#F79023',
};

export default function TwoPanelComponent(props: IProps) {
  const [selectedPanel, setSelectedPanel] = useState(0);

  const { panels = [], labels = [] } = props;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 2 }}>
        <Grid item xl={2} lg={3} md={4} xs={12}>
          <Paper elevation={0} square={true}>
            {labels.map(({ label, count }, index) => (
              <React.Fragment key={index}>
                <Box sx={btnStyle} onClick={() => setSelectedPanel(index)} key={index}>
                  <Typography color={selectedPanel == index ? 'primary' : 'black'}>
                    {label}
                  </Typography>
                  {selectedPanel == index && (
                    <ExpandCircleDownOutlinedIcon sx={expandCircleStyle} />
                  )}
                </Box>
                {labels.length - 1 !== index && <Divider />}
              </React.Fragment>
            ))}
          </Paper>
        </Grid>
        <Grid item xl={10} lg={9} md={8} xs={12}>
          {panels[selectedPanel]}
        </Grid>
      </Grid>
    </Box>
  );
}
