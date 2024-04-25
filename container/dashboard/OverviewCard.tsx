import * as React from 'react';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  Divider,
  Breakpoint,
} from '@mui/material';

interface OverviewCardProps {
  title: string;
  children: JSX.Element;
  headerContent?: JSX.Element;
  maxWidth?: false | Breakpoint | undefined;
}

function OverviewCard({ title, children, headerContent }: OverviewCardProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        borderRadius: '8px',

        width: '100%',
      }}
    >
      <Container
        sx={{
          padding: '0 !important',
          width: '100%',
        }}
      >
        <Card>
          <CardHeader
            disableTypography
            title={
              <Box
                className='dropdown_headings'
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  color='textPrimary'
                  variant='subtitle1'
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {title}
                </Typography>
                {headerContent && headerContent}
              </Box>
            }
          />
          <Divider />
          <CardContent>{children}</CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default OverviewCard;
