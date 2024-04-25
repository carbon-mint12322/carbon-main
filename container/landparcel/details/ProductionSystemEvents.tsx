import React, { useState } from 'react';

import { Grid, Paper } from '@mui/material';

import Map from '~/components/CommonMap';
import Events, { EventData, EventsProps } from '~/container/crop/details/Events';

import mapStyles from '~/styles/theme/map/styles';

import { Coordinate, coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import { CropProgress as CropProgressParams, Farmer, LandParcel } from '~/frontendlib/dataModel';

export interface ProductionSystemEventsData {
  id: string;
  name: string;
  landParcel: string;
  productionSystemId: string;
  productionSystemCategory: string;
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
interface ProductionSystemEventsProps {
  data: LandParcel;
  eventData: EventsProps;
  landParcelMap: string;
  fieldMap: string;
}

const styles = {
  paper: {
    height: '100%',
    p: 1,
  },
};

export default function ProductionSystemEvents({ data, eventData, landParcelMap, fieldMap }: ProductionSystemEventsProps) {
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
          productionSystemId={eventData?.productionSystemId}
          productionSystemCategory={eventData?.productionSystemCategory}
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
            polygons={[
              ...data.fields.map(({ map }) => ({
                options: {
                  ...mapStyles.fieldMap,
                },
                 paths: coordinateStringToCoordinateObject(fieldMap),
              })),
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
