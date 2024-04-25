import { Card, CardActions, CardContent, CardProps, Typography, useTheme } from '@mui/material';

import * as React from 'react';

interface InfoCardActionProps {
  header: string;
  desc?: string;
  action?: JSX.Element;
  CardProps?: CardProps;
  borderVisible?: boolean;
}

function InfoCardAction({
  header,
  desc,
  action,
  CardProps,
  borderVisible = false,
}: InfoCardActionProps) {
  const theme = useTheme();

  return (
    <Card
      {...CardProps}
      sx={{
        bgcolor: 'common.white',
        border: borderVisible ? `2px solid ${theme.palette.primary.main}` : '2px solid #EEEEEE',
        borderRadius: '6px',
        p: 2,
        boxSizing: 'border-box',
        ...CardProps?.sx,
      }}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant='h5'
          component='div'
          sx={{
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '18px',
            color: 'dark.light',
          }}
        >
          {header}
        </Typography>

        {desc && (
          <Typography
            variant='body2'
            color='textSecondary'
            sx={{
              fontWeight: 550,
              fontSize: '14px',
              lineHeight: '17px',
              py: 0.5,
            }}
          >
            {desc}
          </Typography>
        )}
      </CardContent>

      {action && (
        <CardActions
          sx={{
            px: 2,
          }}
        >
          {action}
        </CardActions>
      )}
    </Card>
  );
}

export default InfoCardAction;
