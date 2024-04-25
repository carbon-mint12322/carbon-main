import React, { useEffect } from 'react';
import {
  Button,
  Typography,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Dialog from '~/components/lib/Feedback/Dialog';
import DrawPath from '~/container/landparcel/create/DrawPath/DrawPath';
import dynamic from 'next/dynamic';
import {
  coordinateStringToCoordinateObject,
  coordinateObjectToCoordinateString,
  Coordinate,
  convertKmlToGeoJson,
  coordinateArrayToCoordinateObjectArray,
  polygonToMapCenter,
} from '~/utils/coordinatesFormatter';
import TracePath from '~/container/landparcel/create/TracePath/TracePath';
import { useOperator } from '~/contexts/OperatorContext';
import axios from 'axios';
import CircularLoader from '~/components/common/CircularLoader';
import If, { IfNot } from '~/components/lib/If';
import InfoCardAction from '~/container/landparcel/create/InfoCardAction';
import CommonMap from '~/components/CommonMap';
import MapLandBoundaries from '~/container/landparcel/create/MapLandBoundaries';
import { useAlert } from '~/contexts/AlertContext';
import { Alert } from '@mui/lab';
const LandMapEditor = dynamic(import('~/gen/data-views/landparcel_map/landparcel_mapEditor.rtml'));
// import '~/container/landparcel/create/DrawPath/DrawPath'
type MapType = 'draw' | 'trace';
type DialogType = 'tracePath' | 'drawPath';

function DrawBoundaries({ onChange = console.log, schema }: any) {
  const theme = useTheme();
  const { changeRoute, getAPIPrefix } = useOperator();
  const [openPathDialog, setOpenPathDialog] = React.useState<DialogType>();
  const [obCoordinates, setOBCoordinates] = React.useState<Coordinate[]>();
  const [ibCoordinates, setIBCoordinates] = React.useState<Coordinate[][]>();
  const [mapMode, setMapMode] = React.useState<MapType>();
  const [landparcel, setLandparcel] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<any>([]);
  const [payload, setPayload] = React.useState<any>(null);

  const [status, setStatus] = React.useState(true);

  useEffect(() => {
    function changeStatus() {
      setStatus(navigator.onLine);
    }
    window.addEventListener('online', changeStatus);
    window.addEventListener('offline', changeStatus);
    return () => {
      window.removeEventListener('online', changeStatus);
      window.removeEventListener('offline', changeStatus);
    };
  }, []);

  const { openToast } = useAlert();

  const fullScreen: any = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    setOpenPathDialog(undefined);
  };

  const getApiData = async () => {
    try {
      setLoading(true);
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + '/landparcel/list');
      setData(res?.data);
      return res?.data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCapture = async (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    // @ts-ignore
    const fileUploaded = event?.target?.files[0];
    const geoJson = await convertKmlToGeoJson(URL.createObjectURL(fileUploaded));

    if (geoJson) {
      const _coordinates = geoJson?.features?.reduce((acc: Coordinate[][], data) => {
        const parsedData = data?.geometry?.coordinates.map((item) => {
          //           const parsedContent = coordinateArrayToCoordinateObjectArray(item);
          //           if (parsedContent) {
          //             return parsedContent;
          //           }
          return [];
        });
        if (parsedData) {
          return [...acc, ...(parsedData || [])];
        }
        return acc;
      }, []);

      if (_coordinates && _coordinates?.length > 0) {
        const [obCoordinate, ...rest] = _coordinates;
        setOBCoordinates(obCoordinate);
        setIBCoordinates([...rest]);

        onChange({
          map: coordinateObjectToCoordinateString(_coordinates) || '',
          location: polygonToMapCenter(obCoordinate),
        });
      }
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  const handleSaveChange = (_obCoordinates: Coordinate[], _ibCoordinates?: Coordinate[][]) => {
    setOBCoordinates(_obCoordinates);
    _ibCoordinates && setIBCoordinates(_ibCoordinates);
    setPayload({
      map: _obCoordinates
        ? coordinateObjectToCoordinateString([
          _obCoordinates,
          ...(_ibCoordinates ? _ibCoordinates : []),
        ])
        : '',
      location: polygonToMapCenter(_obCoordinates),
    });

    setOpenPathDialog(undefined);
  };

  const clearMap = () => {
    setOBCoordinates(undefined);
    setIBCoordinates(undefined);
    setPayload({ map: '', location: {} });
  };

  const handleSubmit = async () => {
    if (landparcel && payload && payload.map) {
      if (status) {
        try {
          setLoading(true);
          await axios.post(`${getAPIPrefix()}/landparcel/${landparcel}`, {
            ...payload,
            status: 'Under Review',
          });
          openToast('success', 'Land boundaries submitted successfully.');
        } catch (error: any) {
          console.log(error);
          openToast('error', error?.response?.data?.message || error.message);
        } finally {
          setLoading(false);
        }
      } else {
        var landParcelData = getLocalLandParcelData();

        landParcelData.push({
          id: landparcel,
          data: { ...payload, status: 'Under Review' },
        });

        localStorage.setItem('offline_land_parcel_data', JSON.stringify(landParcelData));

        openToast(
          'info',
          'You are currently offline, so all your changes are recorded locally, those will be synced once you go online.',
        );
      }
    }
  };

  const getLocalLandParcelData = () => {
    var landParcelData: any = localStorage.getItem('offline_land_parcel_data') || '[]';
    try {
      landParcelData = JSON.parse(landParcelData);
    } catch (e) {
      console.log(e);
      landParcelData = [];
    }
    return landParcelData;
  };

  const syncOfflineData = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (status) {
        var landParcelData = getLocalLandParcelData();

        let promises = [];
        for (let i = 0; i < landParcelData.length; i++) {
          const item = landParcelData[i];
          promises.push(axios.post(`${getAPIPrefix()}/landparcel/${item.id}`, item.data));
        }

        await Promise.all(promises);
        openToast('success', 'Your local changes are synced successfully.');
        localStorage.removeItem('offline_land_parcel_data');
      }
    } catch (error) {
      console.log(error);
      openToast('error', 'Something went wrong while synchronizing your data.');
    } finally {
      setLoading(false);
    }
  };

  const renderDialog = () => {
    switch (openPathDialog) {
      case 'drawPath':
        return (
          <DrawPath onSave={handleSaveChange} onCancel={handleClose} fullScreen={fullScreen} />
        );
      case 'tracePath':
        return (
          <TracePath onSave={handleSaveChange} onCancel={handleClose} fullScreen={fullScreen} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CircularLoader value={loading}>
        {getLocalLandParcelData().length > 0 && status && (
          <Alert severity='info'>
            You have some data stored locally which are not synced,{' '}
            <a href='#' onClick={syncOfflineData}>
              <strong>Click here</strong>
            </a>{' '}
            to start sync
          </Alert>
        )}
        <If value={!openPathDialog}>
          <Grid
            sx={{
              maxWidth: '650px',
              pb: 10,
              marginTop: '20px',
            }}
          >
            <Grid container direction='column' spacing={2}>
              <IfNot value={obCoordinates}>
                <Grid item>
                  <InfoCardAction
                    header='Walk around the land parcel boundaries'
                    desc=''
                    action={
                      <>
                        <IfNot value={obCoordinates}>
                          <Button variant='contained'>
                            <Typography
                              noWrap
                              color='common.white'
                              onClick={() => setOpenPathDialog('tracePath')}
                            >
                              Start Walking
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
                    header='Land Parcel boundaries'
                    desc=''
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
                    desc='Directly upload the land parcel boundaries file in KML format.'
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
              </IfNot>

              <If value={obCoordinates}>
                <Grid item height='350px'>
                  <CommonMap polygons={polygons} />
                </Grid>
                <Grid item>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      py: '0.5rem',
                    }}
                  >
                    <Button
                      variant='contained'
                      color='secondary'
                      sx={{ ml: '1rem' }}
                      onClick={clearMap}
                    >
                      Delete
                    </Button>
                  </Box>
                </Grid>
              </If>
            </Grid>
          </Grid>
        </If>
        {openPathDialog && renderDialog()}

        <Grid container spacing={2}>
          <Grid item>
            <InfoCardAction
              header='Select Landparcel and Submit'
              desc='Once you trace or draw the boundries, please select a landparcel from the list and submit.'
              action={
                <Grid container spacing={2}>
                  <Grid xs={12} item>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label'>Land Parcels</InputLabel>
                      <Select
                        disabled={!openPathDialog && (!payload || !payload.map)}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={landparcel}
                        label='Land Parcels'
                        onChange={(e: any) => setLandparcel(e.target.value)}
                      >
                        {data &&
                          data.map((item: any, index: number) => (
                            <MenuItem key={index} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              }
            />
          </Grid>
          <Grid xs={12} item>
            <Button variant='contained' onClick={handleSubmit} disabled={!landparcel}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </CircularLoader>
    </>
  );
}

export default DrawBoundaries;
