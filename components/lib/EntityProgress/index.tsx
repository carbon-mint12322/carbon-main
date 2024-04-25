import React, { useState, useEffect } from 'react';
import { coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import { Grid, Paper } from '@mui/material';
import ProgressTimeline from '~/components/lib/ProgressTimeline';
import { EntityEventTimelineData } from '~/components/lib/ProgressTimeline/index.interface';
import Map from '~/components/CommonMap';
import mapStyles from '~/styles/theme/map/styles';
import axios from 'axios';
import { EntityProgressProps } from './index.interface';
import EntityEvents from '../EntityEvents';
import { EntityEventData } from '../EntityEvents/index.interface';
import { useOperator } from '~/contexts/OperatorContext';

const styles = {
  paper: {
    height: '100%',
    p: 1,
  },
};

export default function EntityProgress({
  data,
  category = 'crop',
  eventData,
  reFetch,
  entity,
  EntityEventEditor
}: EntityProgressProps) {
  const { getApiUrl } = useOperator();
  const [selectedItemEvent, setSelectedItemEvent] = useState<EntityEventData>();
  const [selectedEvent, setSelectedEvent] = useState<EntityEventTimelineData>();
  const [markers, setMarkers] =useState<any>([]);

  async function fetchMarkerData(id?: string){
    return axios(getApiUrl(`/event-markers/${id}`))
  }

  useEffect(() => {
    if (eventData && eventData.data && eventData.data?.length > 0) {
      fetchMarkerData(eventData?.data[0]?.id).then((res) => {
        setMarkers(res.data);
      });
    }
  }, [eventData])

  const handleOnItemSelection = async (eventItem?: EntityEventTimelineData) => {
    setSelectedEvent(eventItem);
    setSelectedItemEvent(undefined);
  };

  const handleOnEventClick = async (eventItem?: EntityEventData) => {
    setSelectedItemEvent(eventItem);
    setSelectedEvent(undefined);
    fetchMarkerData(eventItem?.id).then((res) => {
      setMarkers(res.data);
    })
  };
  return (
    <Grid container direction='row' rowSpacing={3} columnSpacing={4}>
      <Grid item xs={12}>
        <Paper elevation={0} sx={styles.paper}>
          <ProgressTimeline
            data={data}
            category={category}
            onItemSelection={handleOnItemSelection}
            selectedEvent={selectedEvent}
            reFetch={reFetch}
            EntityEventEditor={EntityEventEditor}
          />
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <EntityEvents
          {...eventData}
          entityId={data?.id}
          entity={entity}
          onClick={handleOnEventClick}
          selectedEventId={selectedItemEvent?._id}
          EntityEventEditor={EntityEventEditor}
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
            enableZoom={false}
            markers={markers}
            polygons={[
              {
                options: {
                  ...mapStyles.fieldMap,
                },
                paths: coordinateStringToCoordinateObject(data?.fieldMap),
              },
              data?.plotMap && {
                options: {
                  ...mapStyles.plotMap,
                },
                paths: coordinateStringToCoordinateObject(data?.plotMap),
              },
              {
                options: {
                  ...mapStyles.landParcelMap,
                },
                paths: coordinateStringToCoordinateObject(data?.landParcelMap),
              },
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
