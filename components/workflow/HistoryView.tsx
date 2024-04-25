import { Box, Paper, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { CalendarBlank } from '~/components/Icons';
import React from 'react';

export default function HistoryView({ wf, makeStateArr, stateLabel }: any) {
  const router = useRouter();
  const pagePath = router.asPath;
  const theme = useTheme();

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };
  const cardStyle = {
    ...titleStyle,
    justifyContent: 'space-between',
    padding: '24px 32px',
    marginBottom: '2px',
    cursor: 'pointer',
    marginTop: '20px',
    // '&:hover': {
    //   background: `${theme.palette.primary.main}1F`, // theme.palette.background.paper,
    // },
    background: theme.palette.background.paper, //`${theme.palette.primary.main}14`, // theme.palette.background.paper,
  };

  const contentStyle = { ...titleStyle, gap: '56px' };
  const eventDetails = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  };

  let history = makeStateArr(wf?.state).filter((item: any) => item.name !== 'start');

  const convertObjectToArray = (object: any = {}) => {
    return Object.keys(object).map((key) => ({ key, data: object[key] })) || [];
  };

  return (
      <>
        {history.map(
          HistoryItem(
            cardStyle,
            titleStyle,
            stateLabel,
            convertObjectToArray,
            contentStyle,
            eventDetails,
          ),
        )}
      </>
  );
}
function HistoryItem(
  cardStyle: {
    justifyContent: string;
    padding: string;
    marginBottom: string;
    cursor: string;
    marginTop: string;
    // '&:hover': { background: string };
    background: string;
    display: string;
    alignItems: string;
    gap: string;
  },
  titleStyle: { display: string; alignItems: string; gap: string },
  stateLabel: any,
  convertObjectToArray: (object?: any) => { key: string; data: any }[],
  contentStyle: { gap: string; display: string; alignItems: string },
  eventDetailsStyle: {
    display: string;
    flexDirection: string;
    justifyContent: string;
    alignItems: string;
  },
): any {
  return function HistoryItem(hItem: any, index: number) {
    let label = 'unknown';
    try {
      label = stateLabel(hItem);
    } catch (err) {
      console.error(err);
      return null;
    }
    return (
      <React.Fragment key={index}>
        <Paper sx={cardStyle} square={true} elevation={0}>
          <Box sx={titleStyle} onClick={() => {}}>
            <CalendarBlank color='green' />
            <div>
              <Typography variant='h6'>{label}</Typography>
            </div>
          </Box>
          <Box sx={contentStyle}>
            <Box sx={eventDetailsStyle}>
              {hItem?.data?.event?.userSession?.userId && (
                <Typography variant='subtitle1' sx={{ opacity: '0.6' }}>
                  {hItem?.data?.event?.userSession?.name || hItem?.data?.event?.userSession?.email}
                </Typography>
              )}
              {hItem?.data?.event?.ts && (
                <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                  {dayjs(hItem?.data?.event?.ts).format('DD/MM/YYYY')}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </React.Fragment>
    );
  };
}
