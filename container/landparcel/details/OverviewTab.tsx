import React, { ReactNode, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Divider, Grid, Paper, Typography, useTheme, Button, Link, Container } from '@mui/material';
import { LandParcelFormData } from '~/frontendlib/dataModel';
import { LatLngLiteral } from 'spherical-geometry-js';
import {
  coordinateStringToCoordinateObject,
  polygonToMapCenter,
} from '~/utils/coordinatesFormatter';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';
import { calculatePolygonArea } from '~/utils/mapUtils';
import MarkerToolTip from '~/container/landparcel/details/MarkerToolTip';
import { useAlert } from '~/contexts/AlertContext';

import Map from '~/components/CommonMap';
import { isImgUrl } from '~/frontendlib/util';
import PdfViewerModel from '~/components/ui/PdfViewerModel';
import Dialogs from '~/components/lib/Feedback/Dialog';
import { downloadKML } from '~/utils/createKml';
import { Dialog } from '@mui/material';
import { WeatherReport } from './WeatherTab/WeatherReport';

const LandMapEditor = dynamic(import('~/gen/data-views/landparcel_map/landparcel_mapEditor.rtml'));

interface OverviewTabProps {
  data: {
    id: string;
    polygons?: (any | undefined)[];
    areaInAcres?: number | string;
    surveyNumber?: number | string;
    complianceScore?: number | string;
    climateScore?: number | string;
    landOwner?: string;
    markers?: { position: LatLngLiteral; color: string }[];
    center?: LatLngLiteral;
    landPolygon: any;
    status?: string;
    fields: (any | undefined)[];
    events: (any | undefined)[];
  };
  overviewDataList?: OverviewDataList[];
  showMainButton?: boolean;
  mainButtonTitle?: string;
  handleMainBtnClick?: () => void;
  QRCode?: any;
  kmlString: string;
  kmlName: string;
  reFetch?: () => void;
  showWeatherReport?: boolean
}

interface OverviewDataList {
  icon?: ReactNode;
  title?: ReactNode;
  value?: ReactNode;
  url?: ReactNode;
}

export default function OverviewTab({
  data,
  overviewDataList = [],
  showMainButton = false,
  mainButtonTitle = '',
  handleMainBtnClick,
  QRCode,
  kmlString,
  kmlName,
  reFetch,
  showWeatherReport = false
}: OverviewTabProps) {
  const theme = useTheme();
  const { openToast } = useAlert();
  const router = useRouter();
  const [showPdf, setShowPdf] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [formData, setFormData] = useState<LandParcelFormData>({});
  const { getApiUrl, getAPIPrefix } = useOperator();
  const [showMapEditor, setShowMapEditor] = useState(false);
  const MAP_API_URL = getAPIPrefix() + '/landparcel-maps';
  const [polygonData, setPolygonData] = useState<any[]>();

  const handleMapEdit = async () => {
    try {
      setShowMapEditor(true);
      await axios.get(MAP_API_URL).then((res) => {
        setPolygonData(
          res.data
            .map((item: any) => {
              return {
                id: item.id,
                paths: coordinateStringToCoordinateObject(item.map),
                options: { strokeColor: '#EE4B2B', strokeOpacity: 1, strokeWeight: 4, zIndex: 2 },
              };
            })
            .filter((item: any) => item?.id !== data?.id),
        );
      });
    } catch (err) {
      console.error(err);
    }
  };

  const polygons = useMemo(
    () => [
      ...(data.polygons?.map((item) => ({
        options: item?.options || { strokeColor: theme.palette.common.white, fillColor: '#bbbbbb' },
        paths: item?.paths,
        data: item?.data,
        id: item?.id,
      })) || []),
      data.landPolygon,
    ],
    [data.polygons],
  );

  const updateLandParcel = async (mapData: any) => {
    try {
      setShowMapEditor(false);
      if (mapData?.map) {
        let paths = coordinateStringToCoordinateObject(mapData?.map);
        let acres = calculatePolygonArea({ paths: paths });
        let coordinates = polygonToMapCenter(paths[0]);
        mapData.calculatedAreaInAcres = acres?.toFixed(2);
        mapData.location = coordinates;
        mapData.paths = paths;
      }
      const payload: any = {
        ...mapData,
      };
      console.log(payload);
      delete payload['_id'];
      const res = await axios.post(getApiUrl(`/landparcel/${router.query.id}`), {
        ...payload,
      });
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Land Parcel Saved');
      }
      return true;
    } catch (error: any) {
      openToast('error', error?.message || 'Something went wrong');
      return false;
    }
  };

  const onSubmit = async (updatedMapData: any) => {
    updateLandParcel(updatedMapData);
  };

  const onSubmitForm = (updatedMapData: any) => {
    setFormData({
      ...formData,
      ...updatedMapData,
    });

    onSubmit({
      ...updatedMapData,
    });
  };

  return (
    <Grid container direction='row' height='fit-content' columnGap={4} flexWrap='nowrap'>
      <Grid
        // component={Paper}
        item
        xs={5}
        container
        direction='column'
        // overflow='auto'
        flexWrap='nowrap'
        px={1}
      >
        {QRCode && <QRCode />}
        <Grid
          component={Paper}
          item
          xs={5}
          container
          direction='column'
          // overflow='auto'
          flexWrap='nowrap'
          px={1}
        >
          <Grid
            minHeight={60}
            px='2.5'
            container
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography fontWeight='bold'>Overview</Typography>
            {showMainButton && mainButtonTitle && handleMainBtnClick && (
              <Grid item>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  onClick={handleMainBtnClick}
                  size={'small'}
                >
                  {mainButtonTitle}
                </Button>
              </Grid>
            )}
            {!showMainButton && <Grid item />}
          </Grid>

          <Divider />

          {overviewDataList?.map((item: OverviewDataList, index: number) => (
            <Grid
              key={index}
              minHeight={60}
              px='2.5'
              columnGap={2}
              container
              justifyContent='flex-start'
              alignItems='center'
              paddingX={2}
            >
              {item.icon}
              <Typography color='textSecondary'>{item.title}</Typography>
              {item.value && (
                <Typography fontWeight='bold' ml='auto'>
                  {item.value}
                </Typography>
              )}
              {item.url && (
                <Typography
                  ml='auto'
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() =>
                    isImgUrl(item.url as string) ? setShowImage(true) : setShowPdf(true)
                  }
                >
                  View Document
                </Typography>
              )}
              {item.url && (
                <PdfViewerModel
                  open={showPdf}
                  handleClose={() => setShowPdf(false)}
                  pdfLink={item?.url}
                />
              )}
              {item.url && (
                <Dialogs
                  onClose={() => setShowImage(false)}
                  open={showImage}
                  dialogContentProps={{ sx: { overflow: 'hidden', padding: '0' } }}
                >
                  <img
                    src={item.url as string}
                    style={{
                      overflow: 'hidden',
                      objectFit: 'contain',
                      maxHeight: '100%',
                      maxWidth: '100%',
                    }}
                    alt='document'
                  />
                </Dialogs>
              )}
            </Grid>
          ))}

          {showWeatherReport && data.center && (
            <WeatherReport latLng={data.center} />
          )}
        </Grid>
      </Grid>

      <Grid
        item
        xs={7}
        container
        p={1}
        direction='row'
        component={Paper}
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Map
          polygons={polygons}
          markerToolTip={(marker) => <MarkerToolTip marker={marker} />}
          rowIndex={0}
          isTooltipPresent
          markers={data.markers}
          polygonToolTip={(polygonData) => (
            <Grid container direction='column' flexWrap='nowrap' gap={1}>
              <Typography>{polygonData?.data?.name}</Typography>
              {polygonData?.data?.areaInAcres ? (
                <Grid item>Area: {polygonData?.data?.areaInAcres} Acres</Grid>
              ) : (
                <Grid item>Area: {polygonData?.data?.area} Sqyd</Grid>
              )}
            </Grid>
          )}
          enableZoom={false}
        />
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1vh',
            gap: '2vw',
            paddingRight: '0 !important',
            marginRight: '0 !important',
          }}
        >
          {data?.status === 'Draft' && data?.fields.length === 0 && data?.events.length === 0 ? (
            <Grid container justifyContent='end' alignItems='center'>
              <Link component='button' variant='body2' onClick={() => handleMapEdit()}>
                Edit Map
              </Link>
              <Dialog
                open={showMapEditor}
                onClose={() => setShowMapEditor(false)}
                maxWidth='md'
                fullWidth
              >
                <Grid sx={{ minWidth: 'fit-content', padding: '10px 10px' }}>
                  <LandMapEditor
                    formData={{
                      data: {
                        map: kmlString,
                        location: data?.center,
                      },
                    }}
                    formContext={{ polygon: polygonData }}
                    onSubmit={(updatedMapData: LandParcelFormData) => {
                      onSubmitForm({
                        ...updatedMapData,
                      });
                    }}
                    mainBtnLabel='Submit'
                    onCancelBtnClick={() => setShowMapEditor(false)}
                  />
                </Grid>
              </Dialog>
            </Grid>
          ) : null}
          {kmlString && kmlName && (
            <Grid minWidth='fit-content' justifyContent='end' alignItems='center'>
              <Link
                component='button'
                variant='body2'
                onClick={() => downloadKML(kmlString, kmlName)}
              >
                Download Map
              </Link>
            </Grid>
          )}
        </Container>
      </Grid>
    </Grid>
  );
}
