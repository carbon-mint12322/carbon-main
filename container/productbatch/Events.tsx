import React, { useState } from 'react';

import { Grid, Paper } from '@mui/material';

import Map from '~/components/CommonMap';
import Events, { EventData, EventsProps } from '~/container/crop/details/Events';

import mapStyles from '~/styles/theme/map/styles';

import { Coordinate, coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import {
  CropProgress as CropProgressParams,
  Farmer,
  LandParcel,
  ProductBatch,
} from '~/frontendlib/dataModel';

interface EventDataProps {
  data: ProductBatch;
  eventData: EventsProps;
}

const styles = {
  paper: {
    height: '100%',
    p: 1,
  },
};

export default function ProductBatchEvents({ data, eventData }: EventDataProps) {
  const [selectedItemEvent, setSelectedItemEvent] = useState<EventData>();
  const [location, setLocation] = useState<Coordinate>();

  const handleOnEventClick = (eventItem?: EventData) => {
    setSelectedItemEvent(eventItem);
    setLocation(eventItem?.location);
  };
  return (
    <Grid container direction='row' rowSpacing={3} columnSpacing={4}>
      <Grid item xs={6}>
        <Events
          productBatchId={data?.id}
          {...eventData}
          onClick={handleOnEventClick}
          selectedEventId={selectedItemEvent?._id}
          allowAddEvent={false}
        />
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          height: '60vh',
        }}
      >
        <Paper elevation={0} sx={styles.paper}>
          <Map
            markers={location ? [{ position: location }] : []}
            polygons={[
              ...data.landparcels.map((landparcel) => ({
                options: {
                  ...mapStyles.landParcelMap,
                },
                paths: coordinateStringToCoordinateObject(landparcel.map),
              })),
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
