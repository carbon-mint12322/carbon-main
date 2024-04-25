import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Dialog from '~/components/lib/Feedback/Dialog';
import CardView from '~/components/ui/CardView';
import { Box, Grid, Button, Divider, Typography, Paper, useTheme } from '@mui/material';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { CropEvent, PhotoRecord, CropEventType, CropPlanEvent } from '~/frontendlib/dataModel';
import ImageGroup from '../../components/ImageGroup';
import If, { IfNot } from '~/components/lib/If';
import { useOperator } from '~/contexts/OperatorContext';
import { isoToLocal } from '~/utils/dateFormatter';
import { EventPlanModalHandler } from '../crop/plan/EventPlan';

export interface EventData extends CropEvent {
  cropId?: string;
  poultryId?: string;
  aquacropId?: string;
  productionSystemId?: string;
  processingSystemId?: string;
  landParcelId?: string;
  collectiveId?: string;
  landparcel: any;
  crop: any;
  poultryBatch: any;
  aquacrop: any;
  productionSystem: any;
  processingSystem: any;
  users: any;
  range?: {
    start: number | string;
    end: number | string;
  };
}

export interface EventsProps {
  landParcelId?: string;
  currentPlanId?: string | undefined;
  data: EventData[];
  crop: any;
  eventType?: CropEventType | string;
  showImages?: boolean;
  showActionButton?: boolean;
  showDivider?: boolean;
  onClick?: (event?: EventData) => void;
  selectedEventId?: string;
  setselectedLocation?: any;
  onPlanEventCreateOrUpdateCallback: () => void;
}

export default function Events({
  landParcelId,
  currentPlanId,
  data,
  eventType,
  showImages = true,
  showActionButton = true,
  showDivider = true,
  onClick = () => { },
  selectedEventId,
  setselectedLocation,
  onPlanEventCreateOrUpdateCallback,
}: EventsProps) {
  const router = useRouter();
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const [cardid, setCardid] = useState<EventData>();
  const { changeRoute } = useOperator();
  const [selectedrowid, setSelectedrowid] = useState<string>(
    selectedEventId ? selectedEventId : data?.[0]?._id,
  );

  // variable to set selected scheduled event for edit
  const [eventPlanForEdit, setEventPlanForEdit] = useState<CropPlanEvent>();
  // Toggle modal for Schedule event
  const [planEventModalToggle, setPlanEventModalToggle] = useState(false);

  const titleStyle = { display: 'flex', alignItems: 'center', gap: '6px' };
  const cropDetailsEventCardStyle = (currentEventId: string) => ({
    ...titleStyle,
    justifyContent: 'space-between',
    padding: '7px 7px',
    marginBottom: '1px',
    cursor: 'pointer',
    '&:hover': {
      background: `${theme.palette.primary.main}1F`,
    },
    background:
      selectedrowid === currentEventId
        ? `${theme.palette.primary.main}14`
        : theme.palette.background.paper,
  });
  const contentStyle = { ...titleStyle, gap: '26px' };

  const shuffle = (array: any) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  const getImageLinks = (eventData: CropEvent): string[] =>
    eventData?.photoRecords
      .map((record: PhotoRecord) => record.link)
      .filter((item: string) => !!item);

  const popScheduleEventEditModal = (event: any) => {
    // setting schedule event modal for edit (to pass as props for event plan)
    setEventPlanForEdit(event);

    // toggling modal to show
    setPlanEventModalToggle(true);
  };
  const getEventType = (eventType: string | undefined, category: string) => {
    if (!eventType) {
      return category;
    }
    return eventType;
  };
  const onEventHandler = (e: any, event: EventData) => {
    // Routes will be added here

    const id = event?.id || event?._id;
    const cropId = event?.cropId;
    const landParcelId = event?.landParcelId;
    const poultryId = event?.poultryId;
    const collectiveId = event?.collectiveId;
    const aquacropId = event?.aquacropId;
    const productionSystemId = event?.productionSystemId;
    const processingSystemId = event?.processingSystemId;
    if (event.category === CropEventType.Submissions) {
      changeRoute(`/submission/${id}`);
      return;
    }
    changeRoute(
      cropId
        ? `/crop/${cropId}/event/${id}`
        : landParcelId
          ? `/landparcel/${landParcelId}/event/${id}`
          : poultryId
            ? `/poultrybatch/${poultryId}/event/${id}`
            : aquacropId
              ? `/aquacrop/${aquacropId}/event/${id}`
              : productionSystemId
                ? `/productionsystem/${productionSystemId}/event/${id}`
                : processingSystemId
                  ? `/processingsystem/${processingSystemId}/event/${id}`
                  : `/landparcel/${landParcelId}/event/${id}`,
    );
  };
  const handleOnItemClick = (cardData: EventData) => {
    if (cardData._id !== selectedEventId) {
      onClick && onClick(cardData);
    } else {
      onClick && onClick(undefined);
    }
  };
  const responsiveCard = { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 };

  // hiding schedule event modal
  const hideEventPlanModal = () => setPlanEventModalToggle(false);
  return (
    <>
      {eventPlanForEdit && (
        <EventPlanModalHandler
          action='put'
          currentPlanId={currentPlanId}
          eventPlan={eventPlanForEdit}
          showToggle={planEventModalToggle}
          setShowToggle={setPlanEventModalToggle}
          onClose={hideEventPlanModal}
          onCreateOrUpdateCallback={onPlanEventCreateOrUpdateCallback}
        />
      )}
      <If value={data?.length > 0}>
        {data?.map((cardData: EventData, index: number) => {
          eventType = cardData.category;
          return (
            <div key={`CropDetailsEvents${index}`}>
              <Paper
                sx={cropDetailsEventCardStyle(cardData._id)}
                square={true}
                elevation={0}
                onClick={(e) => onEventHandler(e, cardData)}
              >
                <Box
                  sx={titleStyle}
                  onClick={() => {
                    if (eventType === CropEventType.Submissions) {
                      setSelectedrowid(cardData._id);
                    }
                    if (eventType === CropEventType.Calendar) {
                      onClick(cardData), setSelectedrowid(cardData._id);
                    }
                  }}
                >
                  <Divider
                    orientation='vertical'
                    sx={{
                      background: '#6B6B6B',
                      width: '3px',
                      height: '58px',
                      borderRadius: '2px',
                    }}
                  />

                  <div className='datashower' style={{ width: '450px' }}>
                    {eventType === CropEventType.Submissions && (
                      <Typography variant='h6' fontSize={15}>
                        {cardData.name}
                      </Typography>
                    )}
                    {eventType !== CropEventType.Submissions && (
                      <Typography variant='h6' fontSize={15}>
                        {cardData.details?.name}
                      </Typography>
                    )}
                    <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                      {cardData.createdBy?.name} •{' '}
                      {cardData.location?.lat && cardData.location?.lng
                        ? `Lat: ${cardData.location?.lat.toFixed(2)}º, Lng:
                     ${cardData.location?.lng.toFixed(2)}º • `
                        : ``}
                      {isoToLocal(cardData.createdAt)}
                    </Typography>

                    {/* if crop show crop name and crop id */}
                    {cardData?.crop?.length > 0 && (
                      <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                        Crop: {cardData?.crop?.[0]?.name}, Farmer:{' '}
                        {cardData?.crop?.[0]?.farmer?.name}
                      </Typography>
                    )}
                    {cardData?.aquacrop?.length > 0 && (
                      <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                        Aquaculture Crop: {cardData?.aquacrop?.[0]?.fbId}, Farmer:{' '}
                        {cardData?.aquacrop?.[0]?.farmer?.name}
                      </Typography>
                    )}
                    {cardData?.poultryBatch?.length > 0 && (
                      <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                        Poultry Batch: {cardData?.poultryBatch?.[0]?.batchIdName}, Farmer:{' '}
                        {cardData?.poultryBatch?.[0]?.farmer?.name}
                      </Typography>
                    )}
                    {cardData?.productionSystem?.length > 0 && (
                      <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                        Production System: {cardData?.productionSystem?.[0]?.name},
                        Farmer/Processor: {cardData?.productionSystem?.[0]?.farmer?.name}
                      </Typography>
                    )}
                    {cardData?.processingSystem?.length > 0 && (
                      <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                        Processingn System: {cardData?.processingSystem?.[0]?.name},
                        Farmer/Processor: {cardData?.processingSystem?.[0]?.farmer?.name}
                      </Typography>
                    )}
                    {cardData?.landparcel?.length > 0 && (
                      <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                        Land Parcel: {cardData?.landparcel?.[0]?.name}, Survey No:
                        {cardData?.landparcel?.[0]?.surveyNumber}
                      </Typography>
                    )}
                    {cardData?.users?.length > 0 && (
                      <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                        Created By: {cardData?.users?.[0]?.personalDetails?.firstName}{' '}
                        {cardData?.users?.[0]?.personalDetails?.lastName}
                      </Typography>
                    )}
                    {/* if it is land parcer show land parcel name and survey number */}
                  </div>
                </Box>
                <Box sx={contentStyle}>
                  {showImages && cardData.photoRecords && eventType !== CropEventType.Scheduled && (
                    <ImageGroup
                      ImagesList={shuffle(getImageLinks(cardData))}
                      maxImagesCount={3}
                      eventType={'Submissions'}
                      onclick={() => {
                        setCardid(cardData);
                        return setShow(!show);
                      }}
                    />
                  )}
                </Box>
              </Paper>
            </div>
          );
        })}
      </If>
      {eventType === CropEventType.Submissions && show && (
        <Dialog
          onClose={() => setShow(!show)}
          open={true}
          dialogContentProps={{ sx: { padding: '10' } }}
          fullWidth
          maxWidth='lg'
        >
          <React.Fragment>
            <Typography mt={2} mb='24px'>{`Media`}</Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {cardid?.audioRecords?.map((record: any, index: number) => (
                  <Grid item {...responsiveCard} key={index}>
                    <CardView
                      type='audio'
                      link={record?.link}
                      lat={record?.metadata?.location?.lat}
                      lng={record?.metadata?.location?.lng}
                      timeStamp={record?.metadata?.timestamp}
                      notes={record?.notes}
                      createdBy={cardid?.createdBy.name}
                      selectCheck={false}
                    />
                  </Grid>
                ))}

                {cardid?.photoRecords?.map((record: any, index: number) => (
                  <Grid item {...responsiveCard} key={index}>
                    <CardView
                      type='image'
                      link={record?.link}
                      lat={record?.metadata?.location?.lat}
                      lng={record?.metadata?.location?.lng}
                      timeStamp={record?.metadata?.timestamp}
                      notes={record?.notes}
                      createdBy={cardid?.createdBy.name}
                      selectCheck={false}
                    />
                  </Grid>
                ))}

                {cardid?.documentRecords?.map((record: any, index: number) => (
                  <Grid item {...responsiveCard} key={index}>
                    <CardView
                      type='document'
                      link={record?.link}
                      lat={record?.metadata?.location?.lat}
                      lng={record?.metadata?.location?.lng}
                      timeStamp={record?.metadata?.timestamp}
                      createdBy={cardid?.createdBy.name}
                      selectCheck={false}
                    />
                  </Grid>
                ))}
                {cardid?.notes && (
                  <Grid item {...responsiveCard}>
                    <CardView
                      type='text'
                      lat={cardid?.location?.lat}
                      lng={cardid?.location?.lng}
                      timeStamp={cardid?.createdAt}
                      notes={cardid?.notes}
                      createdBy={cardid?.createdBy.name}
                      selectCheck={false}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </React.Fragment>
        </Dialog>
      )}
      <IfNot value={data?.length > 0}>
        <Typography variant='h5'>No Events Found</Typography>
      </IfNot>
    </>
  );
}
