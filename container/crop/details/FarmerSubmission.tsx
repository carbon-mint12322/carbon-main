import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Paper, Box } from '@mui/material';
import Map from '~/components/CommonMap';
import Events, { EventData, EventsProps } from './Events';
import { Coordinate, coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import globalStyles from '~/styles/theme/brands/styles';
import mapStyles from '~/styles/theme/map/styles';

interface CropProgressProps {
  type?: string;
  eventData: EventsProps;
  landParcelMap: string;
  fieldMap: string;
  plotMap: string;
}

export default function FarmerSubmission({
  type,
  eventData,
  landParcelMap,
  fieldMap,
  plotMap,
}: CropProgressProps) {
  const [location, setLocation] = useState<any[]>(eventData.data?.[0]?.markers);

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
        mt={2}
      >
        <Box
          component={Paper}
          elevation={0}
          style={{ ...globalStyles.dataGridLayer, height: '70vh' }}
        >
          <Events type={type} {...eventData} onClick={() => {}} setselectedLocation={setLocation} />
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
                  paths: coordinateStringToCoordinateObject(fieldMap),
                },
                {
                  options: {
                    ...mapStyles.plotMap,
                  },
                  paths: coordinateStringToCoordinateObject(plotMap),
                },
                {
                  options: {
                    ...mapStyles.landParcelMap,
                  },
                  paths: coordinateStringToCoordinateObject(landParcelMap),
                },
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
