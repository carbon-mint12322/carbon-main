import React, { ReactNode, useState, useMemo, useEffect } from 'react';
import { Divider, Grid, Paper, Typography, useTheme, Button } from '@mui/material';
import { LatLngLiteral } from 'spherical-geometry-js';
import MarkerToolTip from '~/container/landparcel/details/MarkerToolTip';
import { isImgUrl } from '~/frontendlib/util';
import PdfViewerModel from '~/components/ui/PdfViewerModel';
import Dialogs from '~/components/lib/Feedback/Dialog';
import Map from '~/components/CommonMap';
import { QRCode } from '~/frontendlib/QR/QRCode';
import Dialog from '~/components/lib/Feedback/Dialog';
import UpdateEntity from '~/components/lib/Entity/update';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import axios from 'axios';

type OverviewConfig = {
  // UI Schema for displaying overview data
  viewSchema?: any;

  // UI Schema for editing overview data
  editSchema?: any;
}

interface OverviewDataItem {
  icon?: ReactNode;
  title?: ReactNode;
  value?: ReactNode;
  url?: ReactNode;
}

type OverviewData = {
  data: {
    id: string;
    dataPanel?: OverviewDataItem[],
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
    qrLink?: string;
    schema?: string;
    wfName?: string;
    org?: string;
    showMap?: boolean;
    formContext?: any;
    reFetch: () => void;
    validationWorkflowId?: string;
  };
  Editor: any;
};

type OverviewTabProps = OverviewConfig & OverviewData;


function OverviewDataPanel(props: OverviewTabProps) {
  const [showPdf, setShowPdf] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [entityData, setEntityData] = useState();
  const { getAPIPrefix } = useOperator();
  const { openToast } = useAlert();
  
  const getEntityData = async (): Promise<{ data: any }> => {
    try {
      const API_URL = getAPIPrefix() + `/${props.data?.schema}/${props.data?.id}?simple=true`;
      const res: {
        data: any;
      } = await axios.get(API_URL);
      setEntityData(res.data);
      return { data: res?.data || {} };
    } catch (error) {
      console.error(error);
    } 
    return { data: {} };
  };

  const handleSubmit = async (formData: any) => {
    try {
      delete formData._id;
      const apiUrl = getAPIPrefix() + `/${props.data?.schema}/${props.data?.id}`;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res: any) => {
          openToast('success', 'Details updated');
          setOpenModal(false);
          props.data.reFetch();
        });

      props.data?.reFetch;
    } catch (error: any) {
      openToast('error', 'Failed to update details');
      console.log(error);
    }
  }

  useEffect(() => {
    if (!props.data?.validationWorkflowId) {
      getEntityData();
    }
  }, [props.data?.validationWorkflowId]);

  return (
    <Grid component={Paper} item xs={5} container direction='column' flexWrap='nowrap' px={1}>
      <Grid minHeight={60} px='2.5' container justifyContent='space-between' alignItems='center'>
        <Grid
          minHeight={60}
          px='2.5'
          container
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography fontWeight='bold'>Overview</Typography>
          <Grid item>
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={() => { setOpenModal(true) }}
              size={'small'}
            >
              Edit
            </Button>
          </Grid>
        </Grid>

      </Grid>

      <Divider />

      {props.data?.dataPanel?.map((item: OverviewDataItem, index: number) => (
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
          {/* {item.icon} */}
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
              View File
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
      {openModal && <Dialog open={openModal} onClose={() => { setOpenModal(false) }} fullWidth maxWidth={'md'}>
        <Typography variant={'h5'} mt={2}>Edit Details</Typography>
        {props.data?.validationWorkflowId ? (
          <UpdateEntity
            entityId={props.data?.id}
            schema={props.data?.schema}
            entityWfName={props.data?.wfName}
            formContext={props.data?.formContext}
            org={props.data?.org}
            onClick={() => { setOpenModal(false); props.data?.reFetch?.(); }}
          />
        ) : (
            <props.Editor
              data={props.data}
              formData={{
                data: entityData,
              }}
              onSubmit={handleSubmit}
              reFetch={props.data?.reFetch}
              readonly={false}
              formContext={props.data?.formContext}
            />
        )}
        
      </Dialog>}
    </Grid>
  );
}

export default function OverviewTab(props: OverviewTabProps) {
  const {
    data,
    viewSchema,
    editSchema
  } = props;
  const theme = useTheme();

  const polygons = useMemo(
    () => [
      ...(data?.polygons?.map((item) => ({
        options: item?.options || { strokeColor: theme.palette.common.white, fillColor: '#bbbbbb' },
        paths: item?.paths,
        data: item?.data,
        id: item?.id,
      })) || []),
      data?.landPolygon,
    ],
    [data?.polygons],
  );

  return (
    <Grid container direction='row' height='fit-content' columnGap={4} flexWrap='nowrap'>
      <Grid
        item
        xs={5}
        container
        direction='column'
        flexWrap='nowrap'
        px={1}
      >
        {data?.qrLink && <QRCode link={data?.qrLink} />}
        <OverviewDataPanel {...props} />
      </Grid>
      {data?.showMap &&
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
          markers={data?.markers}
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
      </Grid>
      }
    </Grid>
  );
}
