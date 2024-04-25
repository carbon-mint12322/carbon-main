import * as React from 'react';

import { Box, Card, Grid, Link, Typography, useTheme } from '@mui/material';

import Donut from '~/components/common/Chart/Donut';
import { useOperator } from '~/contexts/OperatorContext';

interface PercentageCardProps {
  percent: number;
  title: string;
  redirectionText: string;
  color?: string;
}

function PercentageCard({
  percent,
  title,
  redirectionText,

  color,
}: PercentageCardProps) {
  const theme = useTheme();
  const { changeRoute } = useOperator();

  const redirectionalUrl = () => {
    changeRoute('/landparcel/list');
  };

  return (
    <Grid>
      <Card
        sx={{
          marginBottom: '5px',
          height: '120px',
        }}
      >
        <Box
          className='percentage_card'
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            p: 3,
            pr: 6.25,
            pl: 2.5,
          }}
        >
          <Box
            className='circular_box'
            sx={{
              position: 'relative',
              width: '80%',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Donut
              options={{
                colors: [color || theme.palette.chart.primary, '#F5F5F5'],
              }}
              series={[percent, 100 - percent]}
              height={80}
              width={80}
            />
            <Box>
              <Typography color='textPrimary' variant='h6' fontWeight={700}>
                {parseFloat(String(percent)).toFixed(2)} %
              </Typography>
              <Typography color='textSecondary' variant='subtitle2' fontWeight={600}>
                {title}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    </Grid>
  );
}

export default PercentageCard;
