import React, { useState } from 'react';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import { SxProps } from '@mui/material';
import { Grid } from '@mui/material';
import Map from '~/components/CommonMap';

import Loop from '~/components/lib/Loop';
import PdfViewerModel from '~/components/ui/PdfViewerModel';
import mapStyles from '~/styles/theme/map/styles';
import { Coordinate, coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';

const Chip = (props: Item) => {
  const [showPdf, setShowPdf] = useState(false);
  return (
    <Box sx={{ paddingTop: '28px' }}>
      <Typography variant='subtitle2' sx={{ color: '#757575', paddingBottom: '4px' }}>
        {props?.title}
      </Typography>
      {props.url ? (
        <Typography
          sx={{ cursor: 'pointer', gap: '1', textDecoration: 'underline' }}
          onClick={() => setShowPdf(true)}
        >
          {props?.subText}
        </Typography>
      ) : (
        <Typography sx={{ gap: '1' }}>{props?.subText}</Typography>
      )}
      {props.url && (
        <PdfViewerModel open={showPdf} handleClose={() => setShowPdf(false)} pdfLink={props?.url} />
      )}
    </Box>
  );
};

interface DetailsCardWithMapProps {
  title?: string;
  items?: any[];
  map?: any;
  cardStyle?: SxProps;
  cardTitleBarStyle?: SxProps;
  handleMainBtnClick: () => void;
  showMainBtn?: boolean;
}

export interface Item {
  url?: any;
  title?: string;
  subText?: string;
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
  paper: {
    height: '100%',
    p: 1,
  },
};

function DetailsCardWithMap({
  cardStyle = {},
  cardTitleBarStyle = {},
  title,
  items,
  map,
  handleMainBtnClick,
    showMainBtn = true
}: DetailsCardWithMapProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Paper sx={{ ...styles.cardStyle, ...cardStyle }} elevation={0} square={true}>
          <Box sx={{ ...styles.cardTitleBarStyle, ...cardTitleBarStyle }}>
            <Typography>{title}</Typography>
            {showMainBtn && (<Button
                variant={'contained'}
                color={'primary'}
                onClick={handleMainBtnClick}
                size={'small'}
            >
              {title?.toLowerCase().includes('document') || title?.toLowerCase().includes('file')
                  ? 'Edit'
                  : 'Edit'}
            </Button>)}
          </Box>
          <List>
            <Loop mappable={items} Component={Chip} />
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={0} sx={{ ...styles.paper, height: 500 }}>
          <Map
            polygons={[
              {
                options: {
                  ...mapStyles.landParcelMap,
                },
                paths: coordinateStringToCoordinateObject(map),
              },
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DetailsCardWithMap;
