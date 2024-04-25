import React, { useState } from 'react';

import { Grid, Paper } from '@mui/material';

import Map from '~/components/CommonMap';
import Events, { EventData, EventsProps } from '~/container/crop/details/Events';

import mapStyles from '~/styles/theme/map/styles';

import { Coordinate, coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import { CropProgress as CropProgressParams, Farmer, LandParcel } from '~/frontendlib/dataModel';

export interface ProcessingSystemEventsData {
  id: string;
  name: string;
  landParcel: string;
  processingSystemId: string;
  processingSystemCategory: string;
  croppingSystem: string;
  startDate: string;
  farmer: Farmer;
  landParcelMap: string;
  fieldMap: string;
  areaInAcres: number;
  estimatedYieldTones: number;
  plannedSowingDate: string;
  estHarvestDate: string;
  category: string;
  cropProgress: CropProgressParams;
  location?: Coordinate;
}
interface ProcessingSystemEventsProps {
  data: LandParcel;
  eventData: EventsProps;
  landParcelMap: string;
  fieldMap: string;
  plotMap: string;
}

const styles = {
  paper: {
    height: '100%',
    p: 1,
  },
};

export default function ProcessingSystemEvents({
  data,
  eventData,
  landParcelMap,
  fieldMap,
  plotMap,
}: ProcessingSystemEventsProps) {
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
          processingSystemId={eventData?.processingSystemId}
          processingSystemCategory={eventData?.processingSystemCategory}
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
          <Map
            markers={location ? [{ position: location }] : []}
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
        </Paper>
      </Grid>
    </Grid>
  );
}
