import React, { useState } from 'react';

import { Grid, Paper } from '@mui/material';

import Map from '~/components/CommonMap';
import Events, { EventData, EventsProps } from '~/container/crop/details/Events';

import mapStyles from '~/styles/theme/map/styles';

import { Coordinate, coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import { CropProgress as CropProgressParams, Farmer, LandParcel } from '~/frontendlib/dataModel';

interface CollectiveEventsProps {
  collectiveId: string;
  eventData: EventsProps;
}

const styles = {
  paper: {
    height: '100%',
    p: 1,
  },
};

export default function CollectiveEvents({ collectiveId, eventData }: CollectiveEventsProps) {
  const [selectedItemEvent, setSelectedItemEvent] = useState<EventData>();
  const [location, setLocation] = useState<Coordinate>();

  const handleOnEventClick = (eventItem?: EventData) => {
    setSelectedItemEvent(eventItem);
    setLocation(eventItem?.markers);
  };

  return (
    <Grid container direction='row' rowSpacing={3} columnSpacing={4}>
      <Grid item xs={6}>
        <Events
          collectiveId={collectiveId}
          {...eventData}
          onClick={handleOnEventClick}
          selectedEventId={selectedItemEvent?._id}
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
          <Map markers={location ? [{ position: location }] : []} />
        </Paper>
      </Grid>
    </Grid>
  );
}
