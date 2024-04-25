import React, { ReactNode } from 'react';
import { Box, SxProps, Typography } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import If from './lib/If';

interface EventNameCellProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  sx?: SxProps;
  subTitleSx?: SxProps;
  titleSx?: SxProps;
}

const EventNameCell = ({
  title = null,
  subTitle = null,
  sx = {},
  subTitleSx = {},
  titleSx = {},
}: EventNameCellProps) => {
  return (
    <Box component={'div'} sx={sx}>
      <AccessTimeFilledIcon sx={{ color: 'pending.main' }} />
      <Box component={'div'}>
        <If value={title}>
          <Typography variant='subtitle1' sx={titleSx}>
            {title}
          </Typography>
        </If>
        <If value={subTitle}>
          <Typography variant='subtitle2' sx={subTitleSx}>
            {subTitle}
          </Typography>
        </If>
      </Box>
    </Box>
  );
};
export default EventNameCell;
