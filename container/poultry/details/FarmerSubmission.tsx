import React, { useState } from 'react';

import { Grid, Paper, Box } from '@mui/material';
import Map from '~/components/CommonMap';
import Events, { EventData, EventsProps } from './Events';
import globalStyles from '~/styles/theme/brands/styles';
import mapStyles from '~/styles/theme/map/styles';
import { Coordinate, coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';

interface CropProgressProps {
  eventData: EventsProps;
  landParcelMap: string;
  fieldMap: string;
}

export default function FarmerSubmission({ eventData, landParcelMap, fieldMap }: CropProgressProps) {
  const [location, setLocation] = useState<any>(eventData?.data?.[0]?.location || {});

  return (
    <Grid container flexWrap='nowrap' height='fit-content' spacing={2}>
      <Grid
        component={Paper}
        item
        xs={8}
        md={8}
        container
        direction='column'
        overflow='auto'
        flexWrap='nowrap'
        px={1}
      >
        <Box
          component={Paper}
          elevation={0}
          style={{ ...globalStyles.dataGridLayer, height: '70vh' }}
        >
          <Events {...eventData} onClick={() => {}} setselectedLocation={setLocation} />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid
          container
          minHeight='70vh'
          height='100%'
          justifyContent='center'
          alignItems='center'
          bgcolor='white'
          p={1}
          position='relative'
          component={Paper}
          elevation={0}
          onClick={() => {}}
        >
          <Grid container height='70vh'>
            <Map
              markers={location}
              enableZoom={false}
              polygons={[
                {
                  options: {
                    ...mapStyles.fieldMap,
                  },
                  paths: fieldMap ? coordinateStringToCoordinateObject(fieldMap) : [],
                },
                {
                  options: {
                    ...mapStyles.landParcelMap,
                  },
                  paths: landParcelMap ? coordinateStringToCoordinateObject(landParcelMap) : [],
                },
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
