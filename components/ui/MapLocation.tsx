import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { FieldProps } from '@rjsf/utils';

import Map from '~/components/CommonMap';
import { CustomWidgetsProps } from '~/frontendlib/dataModel';
import {
  Coordinate,
  getCurrentLocation,
  coordinateStringToCoordinateObject,
} from '~/utils/coordinatesFormatter';
import { has } from 'lodash';

export interface MapLocationProps extends FieldProps {}

const MapLocation = ({
  schema,
  formData,
  formContext,
  onChange = () => null,
}: MapLocationProps) => {
  const [value, setValue] = useState<Coordinate>();
  const [currentLocation, setCurrentLocation] = React.useState<Coordinate>({
    lat: 0,
    lng: 0,
  });
  const [obCoordinates, setOBCoordinates] = React.useState<Coordinate[]>();
  const [ibCoordinates, setIBCoordinates] = React.useState<Coordinate[][]>();

  useEffect(() => {
    const mapData = formContext?.map;
    if (mapData && !obCoordinates) {
      if (typeof mapData === 'string') {
        const [_obCoordinates, ...rest] = coordinateStringToCoordinateObject(mapData);
        setOBCoordinates(_obCoordinates);
        setIBCoordinates([...rest]);
      }
    }
  }, []);

  // set location marker
  useEffect(() => {

    if (
      formContext?.location
      && has(formContext, 'location.lat')
      && has(formContext, 'location.lng')
    ) {
      setValue(formContext?.location);
    }

  }, [formContext]);

  const polygons = React.useMemo(
    () => [
      {
        options: {
          strokeColor: '#7fff00',
          fillColor: 'purple',
          fillOpacity: 0.5,
          strokeOpacity: 1,
          strokeWeight: 4,
          clickable: false,
        },
        paths: [obCoordinates || [], ...(ibCoordinates || [])],
      },
    ],
    [obCoordinates, ibCoordinates],
  );

  return (
    <Grid container height='40vh'>
      <Typography>{schema?.title}</Typography>
      <Map
        onMapClick={(c) => {
          setValue(c);
          onChange(c);
        }}
        polygons={polygons}
        markers={value ? [{ position: value }] : []}
      />
    </Grid>
  );
};
export default MapLocation;
