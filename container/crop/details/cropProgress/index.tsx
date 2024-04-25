import React, { useState } from 'react';

import { Grid, Paper } from '@mui/material';

import CropsTimeline, { CropEventTimelineData } from './CropTimeline';
import Map from '~/components/CommonMap';
import Events, { EventData, EventsProps } from '../Events';

import mapStyles from '~/styles/theme/map/styles';

import { Coordinate, coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import { CropProgress as CropProgressParams, Farmer } from '~/frontendlib/dataModel';
import axios from 'axios';

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
interface CropProgressProps {
  data: any;
  category: string;
  eventData: EventsProps;
  reFetch?: () => void;
}

const styles = {
  paper: {
    height: '100%',
    p: 1,
  },
};

export default function CropProgress({
  data,
  category = 'crop',
  eventData,
  reFetch,
}: CropProgressProps) {
  const [selectedItemEvent, setSelectedItemEvent] = useState<EventData>();
  const [location, setLocation] = useState<Coordinate[]>();
  const [selectedEvent, setSelectedEvent] = useState<CropEventTimelineData>();

  const handleOnItemSelection = async (eventItem?: CropEventTimelineData) => {
    setSelectedEvent(eventItem);
    setSelectedItemEvent(undefined);
    // setLocation([eventItem.details?.location] || []);
  };

  const handleOnEventClick = async (eventItem?: EventData) => {
    setSelectedItemEvent(eventItem);
    setSelectedEvent(undefined);
    setLocation(
      await Promise.all(
        eventItem?.details?.evidences?.map(async (evidence: any) => {
          const res = await axios.get(evidence, {
            responseType: 'blob', // important
          });
          const lat = res.headers?.['x-image-meta-property-location-lat'];
          const lng = res.headers?.['x-image-meta-property-location-lng'];
          return { lat, lng };
        }) ?? [],
      ).then((coordinates) => coordinates.filter((coordinate) => coordinate !== null)),
    );
  };

  return (
    <Grid container direction='row' rowSpacing={3} columnSpacing={4}>
      <Grid item xs={12}>
        <Paper elevation={0} sx={styles.paper}>
          <CropsTimeline
            data={data}
            category={category}
            onItemSelection={handleOnItemSelection}
            selectedEvent={selectedEvent}
            reFetch={reFetch}
          />
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <Events
          cropId={category === 'crop' ? data.id : null}
          poultryId={category === 'poultry' ? data.id : null}
          aquaId={category === 'aquacrop' ? data.id : null}
          cowId={category === 'cow' ? data.id : null}
          goatId={category === 'goat' ? data.id : null}
          sheepId={category === 'sheep' ? data.id : null}
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
            markers={location ? location.map((coord) => ({ position: coord })) : []}
            polygons={[
              {
                options: {
                  ...mapStyles.fieldMap,
                },
                paths: coordinateStringToCoordinateObject(data.fieldMap),
              },
              data.plotMap && {
                options: {
                  ...mapStyles.plotMap,
                },
                paths: coordinateStringToCoordinateObject(data.plotMap),
              },
              {
                options: {
                  ...mapStyles.landParcelMap,
                },
                paths: coordinateStringToCoordinateObject(data.landParcelMap),
              },
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
