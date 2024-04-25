import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Paper, Box } from '@mui/material';
import Map from '~/components/CommonMap';
import EntityEvents from './EntityEvents';
import { EntityEventsProps, EntityEventData } from './EntityEvents/index.interface';
import { coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import globalStyles from '~/styles/theme/brands/styles';
import mapStyles from '~/styles/theme/map/styles';

interface FarmerSubmissionProps {
  eventData: EntityEventsProps;
  landParcelMap?: string;
  fieldMap?: string;
  plotMap?: string;
  entity: string;
  entityId: string;
}

export default function FarmerSubmission({
  eventData,
  entity,
  entityId,
  landParcelMap,
  fieldMap,
  plotMap,
}: FarmerSubmissionProps) {
  const [location, setLocation] = useState<any[]>(eventData.data?.[0]?.markers);
  const [selectedItemEvent, setSelectedItemEvent] = useState<EntityEventData>();

  const handleOnEventClick = async (eventItem?: EntityEventData) => {
    setSelectedItemEvent(eventItem);
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
          <EntityEvents
            {...eventData}
            entityId={entityId}
            entity={entity}
            eventType='Submission'
            onClick={handleOnEventClick}
            selectedEventId={selectedItemEvent?._id}
          />
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
                  paths: coordinateStringToCoordinateObject(fieldMap || ''),
                },
                {
                  options: {
                    ...mapStyles.plotMap,
                  },
                  paths: coordinateStringToCoordinateObject(plotMap || ''),
                },
                {
                  options: {
                    ...mapStyles.landParcelMap,
                  },
                  paths: coordinateStringToCoordinateObject(landParcelMap || ''),
                },
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
