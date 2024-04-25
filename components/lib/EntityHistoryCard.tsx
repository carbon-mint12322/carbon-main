import React, { useState } from 'react';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import { SxProps } from '@mui/material';

import Loop from '~/components/lib/Loop';

const Chip = (props: Item) => {
  const formattedTimestamp = props.timestamp ? new Date(props.timestamp).toLocaleString() : '';
  const timezone = props.timestamp
    ? new Date(props.timestamp).toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]
    : '';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: '2px' }}>
      <Typography
        variant='subtitle2'
        sx={{ color: '#757575', paddingRight: '8px', verticalAlign: 'middle' }}
      >
        <span style={{ fontSize: '1.8rem', verticalAlign: 'middle' }}>&bull;</span>{' '}
        {formattedTimestamp}
        {timezone && ` (${timezone})`} -
      </Typography>
      <Typography
        variant='subtitle2'
        sx={{ color: '#757575', display: 'flex', alignItems: 'center' }}
      >
        {props.user && (
          <>
            {props.details && (
              <Typography variant='subtitle2' sx={{ color: '#757575' }}>
                {props.details}
                {'   '}
              </Typography>
            )}
            <Typography variant='subtitle2' sx={{ color: '#757575', paddingLeft: '8px' }}>
              {props.user}
            </Typography>

            {props.role && (
              <>
                <Typography variant='subtitle2' sx={{ color: '#757575', paddingLeft: '8px' }}>
                  (
                </Typography>
                <Typography variant='subtitle2' sx={{ color: '#757575' }}>
                  {props.role}
                </Typography>
                <Typography variant='subtitle2' sx={{ color: '#757575' }}>
                  )
                </Typography>
              </>
            )}
          </>
        )}
      </Typography>
    </Box>
  );
};

export interface Item {
  user?: string;
  role?: string;
  timestamp?: string;
  details?: string;
}

const styles = {
  cardTitleBarStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStyle: {
    padding: '32px 48px',
  },
};

function EntityHistoryCard(props: any) {
  const items = props?.data?.history?.map((item: any) => {
    const userFullName = `${item.userItem?.personalDetails?.firstName} ${item.userItem?.personalDetails?.lastName}`;
    const userRoles = item.userItem?.roles[props?.data?.collective?.slug]?.join(', ');

    return {
      timestamp: item.createdAt,
      user: `  ${userFullName}`,
      details: `Modified by: `,
      role: userRoles,
    };
  });
  const title = 'History';
  return (
    <Paper sx={{ ...styles.cardStyle }} elevation={0} square={true}>
      <Box sx={{ ...styles.cardTitleBarStyle }}>
        <Typography>{title}</Typography>
      </Box>
      <List>
        <Loop mappable={items} Component={Chip} />
      </List>
    </Paper>
  );
}
export default EntityHistoryCard;
