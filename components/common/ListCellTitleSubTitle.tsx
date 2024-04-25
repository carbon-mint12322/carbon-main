import React, { ReactNode } from 'react';
import { Box, SxProps, Typography } from '@mui/material';
import Image from 'next/image';

import If from '../lib/If';

interface ListCellTitleSubTitleProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  image?: string;
  sx?: SxProps;
  subTitleSx?: SxProps;
  titleSx?: SxProps;
}

const ListCellTitleSubTitle = ({
  title = null,
  subTitle = null,
  image,
  sx = {},
  subTitleSx = {},
  titleSx = {},
}: ListCellTitleSubTitleProps) => {
  return (
    <Box component={'div'} sx={sx}>
      <Image src={image as string} height={40} width={40} alt='cellimage' />
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
export default ListCellTitleSubTitle;
