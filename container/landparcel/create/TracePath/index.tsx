import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleMap, MarkerF, PolylineF, PolygonF } from '@react-google-maps/api';

import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';

import CircularLoader from '~/components/common/CircularLoader';
import If from '~/components/lib/If';
import { Coordinate, getCurrentLocation } from '~/utils/coordinatesFormatter';
import mapStyles from '~/styles/theme/map/styles';

export interface TracePathProps {
  coordinates?: Coordinate[];
  currentLocation?: Coordinate;
  onMapCoordinatesChange?: (coordinates: Coordinate[]) => void;
  onMapCurrentLocationChange?: (coordinates: Coordinate) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

const TracePath = ({
  onMapCoordinatesChange = (coordinates: Coordinate[]) => null,
  onMapCurrentLocationChange = (coordinates: Coordinate) => null,
  onSave = () => null,
  onCancel = () => null,
  ...props
}: TracePathProps) => {
  const mapRef: any = useRef();
  const [coordinates, setCoordinates] = useState<Coordinate[]>();
  const [currentLocation, setCurrentLocation] = useState<Coordinate>();
  const [captureOn, setCaptureOn] = useState<number>();

  const resetState = () => {
    setCoordinates(undefined);
    setCaptureOn(undefined);
    getData();
  };

  const handleButtonClick = () => {
    if (navigator.geolocation && !captureOn) {
      const id = navigator.geolocation.watchPosition(function (position) {
        const _coordinates = [
          ...(coordinates || []),
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        ];
        setCoordinates(_coordinates);
        onMapCoordinatesChange(_coordinates);
      });
      setCaptureOn(id);
    } else if (captureOn) {
      navigator.geolocation.clearWatch(captureOn);
    }
  };

  useEffect(() => {
    if (!props?.currentLocation) {
      getData();
    } else {
      setCurrentLocation(props?.currentLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props?.coordinates && props?.coordinates?.length > 0 && !coordinates) {
      setCoordinates(coordinates);
    }
  }, [props?.coordinates]);

  const getData = async () => {
    // On Page Reload -> fetch current location
    const { lat, lng } = await getCurrentLocation();
    const _coordinate = {
      lat,
      lng,
    };
    setCurrentLocation(_coordinate);
    setCoordinates([_coordinate]);
    onMapCurrentLocationChange(_coordinate);
  };

  function UpdateMapControls({ map }: any) {
    const controlButtonsDiv = document.createElement('div');
    if (controlButtonsDiv != null) {
      map.controls[google?.maps?.ControlPosition?.BOTTOM_CENTER].clear(); // eslint-disable-line
    }
    controlButtonsDiv.setAttribute('id', 'ButtonsDiv');
    const root = createRoot(controlButtonsDiv);
    root.render(
      <Stack direction='row' spacing={1} paddingBottom='30px'>
        <Button
          color='primary'
          variant='contained'
          onClick={() => {
            handleButtonClick();
          }}
          sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          {!captureOn ? 'Start' : 'Stop'}
        </Button>

        <Button
          id='resetButton'
          color='primary'
          variant='contained'
          onClick={resetState}
          sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Reset
        </Button>
        <Button
        id='saveButton'
          color='primary'
          variant='contained'
          onClick={onSave}
          sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Save
        </Button>
        <Button
         id='cancelButton'
          color='primary'
          variant='contained'
          onClick={onCancel}
          sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Cancel
        </Button>
      </Stack>,
    );
    map.controls[google?.maps?.ControlPosition?.BOTTOM_CENTER].push(controlButtonsDiv); // eslint-disable-line
  }

  return (
    <>
      <CircularLoader value={Boolean(!currentLocation)}>
        <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <GoogleMap
            center={currentLocation}
            onLoad={(map) => {
              map.setMapTypeId('satellite');
              mapRef.current = map;
              UpdateMapControls({
                map: { ...map },
              });
            }}
            zoom={20}
            ref={mapRef}
            mapContainerStyle={{ width: '100%', height: '70vh' }}
            options={{
              draggableCursor: 'crosshair',
              draggingCursor: 'crosshair',
            }}
          >
            <If value={coordinates && coordinates?.length > 0}>
              {coordinates?.map((mark, index) => (
                <MarkerF
                  icon={{
                    path: 'm -3, 0 a 3,3 0 1,0 6,0 a 3,3 0 1,0 -6,0',
                    scale: 2,
                    fillColor: 'red',
                    fillOpacity: 1.0,
                    strokeColor: 'gold',
                    strokeWeight: 3,
                  }}
                  key={index}
                  position={mark}
                />
              ))}
              <If value={captureOn}>
                <>
                  <PolylineF
                    path={coordinates}
                    options={{
                      strokeColor: '#7fff00',
                      strokeOpacity: 1,
                      strokeWeight: 4,
                    }}
                  />
                  <PolygonF path={coordinates} options={mapStyles.landParcelMap} />
                </>
              </If>
            </If>
          </GoogleMap>
        </Grid>
      </CircularLoader>
    </>
  );
};

export default TracePath;
