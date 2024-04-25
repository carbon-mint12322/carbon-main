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
import MapControls from './MapControls';
import DrawPathProvider, { useDrawPathContext } from './context';
import ReactDOM from 'react-dom';
import { createPortal } from 'react-dom';

export interface DrawPathProps {
  coordinates?: Coordinate[];
  currentLocation?: Coordinate;
  onMapCoordinatesChange?: (coordinates: Coordinate[]) => void;
  onMapCurrentLocationChange?: (coordinates: Coordinate) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

interface CaptureOnMapEvent {
  outerBoundary: boolean;
  innerBoundary: boolean;
  outerBoundaryCompleted: boolean;
  innerBoundaryCompleted: boolean;
}

type BoundaryType = 'outerBoundary' | 'innerBoundary';

const DrawPathComponent = () => {
  const mapRef: any = useRef();
  const controlRef: any = useRef();
  const {
    outerBoundaryCoordinates,
    setOuterBoundaryCoordinates,
    innerBoundaryCoordinates,
    setInnerBoundaryCoordinates,
    currentLocation,
    setCurrentLocation,
    captureOn,
    setCaptureOn,
    resetState,
    handleButtonClick,
    handleMapClick,
    onSave,
    onCancel,
  } = useDrawPathContext();

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
            handleButtonClick('outerBoundary');
            console.log(
              '🚀 ~ file: MapControls.tsx:18 ~ MapControls ~ handleButtonClick',
              captureOn?.outerBoundary,
            );
          }}
          disabled={captureOn?.outerBoundaryCompleted}
          sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          {!captureOn?.outerBoundary ? 'Start outer Boundaries' : 'Stop outer Boundaries'}
        </Button>
        <Button
          color='primary'
          variant='contained'
          onClick={() => handleButtonClick('innerBoundary')}
          disabled={!captureOn?.outerBoundaryCompleted}
          sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          {!captureOn?.innerBoundary ? 'Start inner Boundaries' : 'Stop inner Boundaries'}
        </Button>

        <Button
          color='primary'
          variant='contained'
          onClick={resetState}
          sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Reset
        </Button>
        <Button
          color='primary'
          variant='contained'
          // onClick={onSave}
          sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Save
        </Button>
        <Button
          color='primary'
          variant='contained'
          // onClick={onCancel}
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
            onClick={handleMapClick}
            zoom={20}
            ref={mapRef}
            mapContainerStyle={{ width: '100%', height: '70vh' }}
            options={{
              draggableCursor: 'crosshair',
              draggingCursor: 'crosshair',
            }}
          >
            <If value={outerBoundaryCoordinates && outerBoundaryCoordinates?.length > 0}>
              {outerBoundaryCoordinates?.map((mark, index) => (
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
              <If value={captureOn?.outerBoundary}>
                <>
                  <PolylineF
                    path={outerBoundaryCoordinates}
                    options={{
                      strokeColor: '#7fff00',
                      strokeOpacity: 1,
                      strokeWeight: 4,
                    }}
                  />
                  <PolygonF path={outerBoundaryCoordinates} options={mapStyles.landParcelMap} />
                </>
              </If>
              <If value={captureOn?.innerBoundary}>
                <>
                  <PolylineF
                    path={innerBoundaryCoordinates}
                    options={{
                      strokeColor: '#7fff00',
                      strokeOpacity: 1,
                      strokeWeight: 4,
                    }}
                  />
                  <PolygonF path={innerBoundaryCoordinates} options={mapStyles.fieldMap} />
                </>
              </If>
            </If>
          </GoogleMap>
        </Grid>
      </CircularLoader>
    </>
  );
};

export default function DrawPath(props: DrawPathProps) {
  return (
    <DrawPathProvider {...props}>
      <DrawPathComponent />
    </DrawPathProvider>
  );
}
