import React, { useState } from 'react';

import { Grid, Paper } from '@mui/material';

import Map from '~/components/CommonMap';
import Events, { EventData, EventsProps } from '~/container/crop/details/Events';

import mapStyles from '~/styles/theme/map/styles';

import { Coordinate, coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import { CropProgress as CropProgressParams, Farmer, LandParcel } from '~/frontendlib/dataModel';

export interface CropData {
  id: string;
  name: string;
  landParcel: string;
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
interface LandParcelProps {
  data: LandParcel;
  eventData: EventsProps;
}

const styles = {
  paper: {
    height: '100%',
    p: 1,
  },
};

export default function LandParcelEvents({ data, eventData }: LandParcelProps) {
  const [selectedItemEvent, setSelectedItemEvent] = useState<EventData>();
  const [location, setLocation] = useState<any[]>(eventData?.data?.[0]?.markers);

  const handleOnEventClick = (eventItem?: EventData) => {
    setSelectedItemEvent(eventItem);
    setLocation(eventItem?.markers);
  };
  return (
    <Grid container direction='row' rowSpacing={3} columnSpacing={4}>
      <Grid item xs={6}>
        <Events
          landParcelId={data?.id}
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
            markers={location ? location : []}
            polygons={[
              ...data?.fields.map(({ map }) => ({
                options: {
                  ...mapStyles.fieldMap,
                },
                paths: coordinateStringToCoordinateObject(map),
              })),
              {
                options: {
                  ...mapStyles.landParcelMap,
                },
                paths: coordinateStringToCoordinateObject(data.map),
              },
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
