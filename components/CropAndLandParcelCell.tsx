import React, { ReactNode } from 'react';
import { Box, SxProps, Typography } from '@mui/material';
import Image from 'next/image';

import cropImg from '../public/assets/images/crop.svg';
import If from './lib/If';

interface CropAndLandParcelCellProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  sx?: SxProps;
  subTitleSx?: SxProps;
  titleSx?: SxProps;
}

const CropAndLandParcelCell = ({
  title = null,
  subTitle = null,
  sx = {},
  subTitleSx = {},
  titleSx = {},
}: CropAndLandParcelCellProps) => {
  return (
    <Box component={'div'} sx={sx}>
      <Image src={cropImg} height={40} width={40} alt='cropImg' />
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
export default CropAndLandParcelCell;
