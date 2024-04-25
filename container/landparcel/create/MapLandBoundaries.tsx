import React, { useEffect } from 'react';
import { Button, Typography, Grid, Box, useTheme, useMediaQuery } from '@mui/material';
import { FieldProps } from '@rjsf/utils';

import InfoCardAction from './InfoCardAction';
import DrawPath from './DrawPath/DrawPath';
import AdjustPath from './DrawPath/AdjustPath';
import If, { IfNot } from '~/components/lib/If';
import CommonMap from '~/components/CommonMap';
import { CustomWidgetsProps } from '~/frontendlib/dataModel';
import {
  coordinateStringToCoordinateObject,
  coordinateObjectToCoordinateString,
  Coordinate,
  convertKmlToGeoJson,
  coordinateArrayToCoordinateObjectArray,
  polygonToMapCenter,
} from '~/utils/coordinatesFormatter';
import Dialog from '~/components/lib/Feedback/Dialog';
import TracePath from './TracePath/TracePath';

export interface MapLandBoundariesProps extends FieldProps { }

type DialogType = 'tracePath' | 'drawPath' | 'correctPath';

function MapLandBoundaries({
  schema,
  value,
  formData,
  formContext,
  readonly,
  onChange = () => null,
}: MapLandBoundariesProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openPathDialog, setOpenPathDialog] = React.useState<DialogType>();
  const [obCoordinates, setOBCoordinates] = React.useState<Coordinate[]>();
  const [ibCoordinates, setIBCoordinates] = React.useState<Coordinate[][]>();
  const [refObCoordinates, setRefOBCoordinates] = React.useState<Coordinate[]>();
  const [refIbCoordinates, setRefIBCoordinates] = React.useState<Coordinate[][]>();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  useEffect(() => {
    const refmap = formContext?.map;
    if (refmap) {
      const [_obCoordinates, ...rest] = coordinateStringToCoordinateObject(refmap);
      setRefOBCoordinates(_obCoordinates);
      setRefIBCoordinates([...rest]);
    }

    if (schema.type === 'object') {
      const mapData = value?.map || formData?.map;
      if (mapData && !obCoordinates) {
        if (typeof mapData === 'string') {
          const [_obCoordinates, ...rest] = coordinateStringToCoordinateObject(mapData);
          setOBCoordinates(_obCoordinates);
          setIBCoordinates([...rest]);
        }
      }
    } else if (schema.type === 'string') {
      const mapData = value || formData;
      if (mapData && !obCoordinates) {
        if (typeof mapData === 'string') {
          const [_obCoordinates, ...rest] = coordinateStringToCoordinateObject(mapData);
          setOBCoordinates(_obCoordinates);
          setIBCoordinates([...rest]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleCorrectMap = () => {
    setIsDialogOpen(true);
  };

  const handleCapture = async (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    // @ts-ignore
    const fileUploaded = event?.target?.files[0];
    const geoJson = await convertKmlToGeoJson(URL.createObjectURL(fileUploaded));

    if (geoJson) {
      const _coordinates = geoJson?.features?.reduce((acc: Coordinate[][], data) => {
        const {
          geometry: { coordinates },
        } = data;

        if (
          coordinates &&
          Array.isArray(coordinates?.[0]) &&
          typeof coordinates?.[0]?.[0] === 'number'
        ) {
          const parsedData = coordinateArrayToCoordinateObjectArray(coordinates as number[][]);
          if (parsedData) {
            return [...acc, ...([parsedData] || [])];
          }
          return acc;
        } else if (
          coordinates &&
          Array.isArray(coordinates?.[0]) &&
          typeof coordinates?.[0]?.[0] === 'object'
        ) {
          const parsedData = coordinates.map((item) => {
            const parsedContent = coordinateArrayToCoordinateObjectArray(item as number[][]);
            if (parsedContent) {
              return parsedContent;
            }
            return [];
          });

          if (parsedData) {
            return [...acc, ...(parsedData || [])];
          }
          return acc;
        } else {
          return acc;
        }
      }, []);

      if (_coordinates && _coordinates?.length > 0) {
        const [obCoordinate, ...rest] = _coordinates;
        setOBCoordinates(obCoordinate);
        setIBCoordinates([...rest]);

        onChange(coordinateObjectToCoordinateString(_coordinates) || '');
        // onChange({
        //   map: coordinateObjectToCoordinateString(_coordinates) || '',
        //   location: polygonToMapCenter(obCoordinate),
        // });
      }
    }
  };

  const handleClose = () => {
    setOpenPathDialog(undefined);
  };

  const handleSaveChange = (_obCoordinates: Coordinate[], _ibCoordinates?: Coordinate[][]) => {
    setOBCoordinates(_obCoordinates);
    _ibCoordinates && setIBCoordinates(_ibCoordinates);
    onChange(
      _obCoordinates
        ? coordinateObjectToCoordinateString([
          _obCoordinates,
          ...(_ibCoordinates ? _ibCoordinates : []),
        ])
        : '',
    );
    // TODO Need to clean up the code
    // if (schema.type === 'string') {
    //   onChange(
    //     _obCoordinates
    //       ? coordinateObjectToCoordinateString([
    //           _obCoordinates,
    //           ...(_ibCoordinates ? _ibCoordinates : []),
    //         ])
    //       : '',
    //   );
    // } else {
    //   onChange(_obCoordinates
    //       ? coordinateObjectToCoordinateString([
    //         _obCoordinates,
    //         ...(_ibCoordinates ? _ibCoordinates : []),
    //       ])
    //       : '');
    //   onChange({
    //     map: _obCoordinates
    //       ? coordinateObjectToCoordinateString([
    //           _obCoordinates,
    //           ...(_ibCoordinates ? _ibCoordinates : []),
    //         ])
    //       : '',
    //     location: polygonToMapCenter(_obCoordinates),
    //   });
    // }
    handleClose();
  };

  const resetState = () => {
    setOBCoordinates(undefined);
    onChange('');
  };

  const refPolygons = React.useMemo(
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
        paths: [refObCoordinates || [], ...(refIbCoordinates || [])],
      },
    ],
    [refObCoordinates, refIbCoordinates],
  );

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

  const renderDialog = () => {
    switch (openPathDialog) {
      case 'drawPath':
        return (
          <Dialog
            fullScreen={fullScreen}
            fullWidth
            maxWidth={'lg'}
            open={Boolean(openPathDialog)}
            onClose={handleClose}
            title={'Draw boundaries'}
            dialogContentProps={{
              sx: fullScreen
                ? {
                  padding: 0,
                }
                : {},
            }}
          >
            <AdjustPath
              inactivePolygons={formContext?.polygon}
              polygons={refPolygons}
              onSave={handleSaveChange}
              onCancel={handleClose}
              fullScreen
            />
          </Dialog>
        );
      case 'tracePath':
        return (
          <Dialog
            fullScreen={fullScreen}
            fullWidth
            maxWidth={'lg'}
            open={Boolean(openPathDialog)}
            onClose={handleClose}
            title={'Land Parcel Boundaries'}
            dialogContentProps={{
              sx: fullScreen
                ? {
                  padding: 0,
                }
                : {},
            }}
          >
            <TracePath onSave={handleSaveChange} onCancel={handleClose} fullScreen={fullScreen} />
          </Dialog>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Grid
        sx={{
          maxWidth: '100%',
          pb: 5,
        }}
      >
        <Grid container direction='column' spacing={2}>
          <IfNot value={obCoordinates}>
            <If value={readonly == false}>
              <Grid item>
                <InfoCardAction
                  header='Area boundaries'
                  desc='Trace the area boundaries on a map.'
                  action={
                    <>
                      <IfNot value={obCoordinates}>
                        <Button variant='contained' onClick={() => setOpenPathDialog('drawPath')}>
                          <Typography noWrap color='common.white'>
                            Draw boundaries
                          </Typography>
                        </Button>
                      </IfNot>
                    </>
                  }
                />
              </Grid>

              <Grid item>
                <Typography noWrap variant='subtitle1'>
                  Or
                </Typography>
              </Grid>

              <Grid item>
                <InfoCardAction
                  header='Upload KML File'
                  desc='Directly upload the area boundaries file in KML format.'
                  action={
                    <>
                      <Button variant='contained' component='label'>
                        <Typography noWrap color='common.white'>
                          Upload KML File
                        </Typography>
                        <input type='file' accept='.kml' hidden onChange={handleCapture} />
                      </Button>
                    </>
                  }
                />
              </Grid>
            </If>
          </IfNot>

          <If value={obCoordinates}>
            <Grid item height='70vh'>
              <CommonMap polygons={polygons} inactivePolygons={formContext?.polygon} />
            </Grid>
            <If value={readonly == false}>
              <Grid container spacing={2} sx={{ mt: '1rem' }}>
                <Grid item>
                  <Button
                    variant='contained'
                    color='secondary'
                    sx={{ ml: '1rem' }}
                    onClick={resetState}
                  >
                    Delete
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => setOpenPathDialog('correctPath')}
                  >
                    Adjust Map
                  </Button>
                </Grid>
              </Grid>
              <Dialog
                fullScreen
                fullWidth
                maxWidth={'lg'}
                open={Boolean(openPathDialog)}
                onClose={handleClose}
                title={'Adjust Land Parcel boundaries'}
                dialogContentProps={{
                  sx: {
                    padding: 0,
                  },
                }}
              >
                <AdjustPath
                  inactivePolygons={formContext?.polygon}
                  polygons={polygons}
                  onSave={handleSaveChange}
                  onCancel={handleClose}
                  fullScreen
                />
              </Dialog>
            </If>
          </If>
        </Grid>
      </Grid>

      <If value={openPathDialog}>{renderDialog()}</If>
    </>
  );
}

export default MapLandBoundaries;
