import React from 'react';

import Image from 'next/image';
import { Box, Card, Grid, SxProps, Tooltip, Typography, Link } from '@mui/material';
import { useOperator } from '~/contexts/OperatorContext';

interface CountCardProps {
  count: number | string;
  title: string;
  icon: string;
  unit?: string;
  sx?: SxProps;
  redirectionUrl?: string;
  redirectionText?: string;
}

function CountCard({
  count,
  title,
  icon,
  unit,
  // redirectionUrl
  sx = {},
}: CountCardProps) {
  const { changeRoute } = useOperator();

  const redirectionUrl = () => {
    if (
      title === 'Total Crops' ||
      title === 'Total Cultivated Area (acres)' ||
      title === 'Total Effective Crops Area (acres)' ||
      title === 'Active Cropped Area' ||
      title === 'Crops' ||
      title === 'Pending Events'
    ) {
      changeRoute('/crop/list');
    } else if (title === 'Aqua Ponds') {
      changeRoute('/productionsystem/list');
    } else if (
      title === 'Dairy Production Systems' ||
      title === 'Poultry Production Systems' ||
      title === 'Sheep Production Systems' ||
      title === 'Goat Production Systems' ||
      title === 'Aquaculture Production Systems' ||
      title === 'Sericulture Production Systems'
    ) {
      changeRoute('/productionsystem/list');
    } else if (title === 'Cows') {
      changeRoute('/cow/list');
    } else if (title === 'Goats') {
      changeRoute('/goat/list');
    } else if (title === 'Sheep') {
      changeRoute('/sheep/list');
    } else if (
      title === 'Active Aqua Crops' ||
      title === 'High-Risk Aqua Farms' ||
      title === 'Aquaculture Crops'
    ) {
      changeRoute('/aquacrop/list');
    } else if (
      title === 'Land Parcels' ||
      title === 'Total Registered Area (acres)' ||
      title === 'Total Calculated Area (acres)' ||
      title === 'Mapped Area' ||
      title === 'Registered Area' ||
      title === 'Processing Places' ||
      title === 'Processing Systems' ||
      title === 'Farms' ||
      title === 'Aqua Farms'
    )
      changeRoute('/landparcel/list');
    else if (title === 'Processors') changeRoute('/processor/list');
    else if (title === 'Products') changeRoute('/product/list');
    else if (title === 'Product Batches') changeRoute('/productbatch/list');
    else if (
      title === 'Poultry Rearing Batches' ||
      title === 'Poultry Layer Batches' ||
      title === 'Todays Mortality' ||
      title === 'High-Risk Farms' ||
      title === 'Poultry Pending Events'
    )
      changeRoute('/poultrybatch/list');
    else if (title === 'Pending Tasks') changeRoute('/task/list');
    else changeRoute('/farmer/list');
  };

  return (
    <Card
      sx={{
        marginBottom: '5px',
        height: '120px',
      }}
    >
      <Box onClick={redirectionUrl} sx={{ cursor: 'pointer' }}>
        <Grid
          container
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            p: 2.5,
            pb: 2,
            height: '100%',
            ...sx,
          }}
          spacing={1}
        >
          <Grid item xs={9}>
            <Box
              sx={{
                alignItems: 'baseline',
                display: 'flex',
                width: 'fit-content',
              }}
            >
              <Typography color='textPrimary' variant='h6'>
                {count}
              </Typography>
              {unit && (
                <Typography
                  color='textPrimary'
                  variant='subtitle2'
                  sx={{
                    ml: 0.2,
                  }}
                >
                  <span>{unit}</span>
                </Typography>
              )}
            </Box>
            <Tooltip title={title}>
              <Typography
                color='textSecondary'
                variant='subtitle2'
                sx={{
                  width: 'fit-content',
                  fontWeight: '100',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '1em',
                }}
              >
                {title}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Image src={icon} height={40} width={40} alt='cropImg' />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

export default CountCard;
