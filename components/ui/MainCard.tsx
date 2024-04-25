import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import React from 'react';

const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 },
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

interface MainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  children?: React.ReactNode;
  content?: boolean;
  contentClass?: string;
  contentSX?: object;
  darkTitle?: string;
  secondary?: React.ReactNode;
  shadow?: string;
  sx?: object;
  title?: string;
}

const MainCard = ({
  border = true,
  boxShadow,
  children,
  content = true,
  contentClass = '',
  contentSX = {},
  darkTitle,
  secondary,
  shadow,
  sx = {},
  title,
  ...others
}: MainCardProps) => (
  <Card
    {...others}
    sx={{
      border: border ? '1px solid' : 'none',
      ':hover': {
        boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit',
      },
      ...sx,
    }}
  >
    <>
      {/* card header and action */}
      {!darkTitle && title && <CardHeader sx={headerSX} title={title} action={secondary} />}
      {darkTitle && title && (
        <CardHeader
          sx={headerSX}
          title={<Typography variant='h3'>{title}</Typography>}
          action={secondary}
        />
      )}

      {/* content & header divider */}
      {title && <Divider />}

      {/* card content */}
      {content && (
        <CardContent sx={contentSX} className={contentClass}>
          {children}
        </CardContent>
      )}
      {!content && children}
    </>
  </Card>
);

export default MainCard;
