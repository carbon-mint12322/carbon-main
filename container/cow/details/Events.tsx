import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Dialog from '~/components/lib/Feedback/Dialog';
import CardView from '~/components/ui/CardView';
import { Box, Grid, Button, Divider, IconButton, Typography, Paper, useTheme } from '@mui/material';

import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

import {
  PoultryEvent,
  PhotoRecord,
  PoultryEventType,
  Poultry,
  PoultryPlanEvent,
} from '~/frontendlib/dataModel';

import ImageGroup from '../../../components/ImageGroup';
import If, { IfNot } from '~/components/lib/If';
import { relative } from 'path';
import { useOperator } from '~/contexts/OperatorContext';
import { isoToLocal } from '~/utils/dateFormatter';
import { EventPlanModalHandler } from '~/container/crop/plan/EventPlan';

export interface EventData extends PoultryEvent {
  range?: {
    start: number | string;
    end: number | string;
  };
}

export interface EventsProps {
  poultryId?: string;
  currentPlanId: string | undefined;
  data: EventData[];
  eventType: PoultryEventType;
  showImages?: boolean;
  showActionButton?: boolean;
  showDivider?: boolean;
  onClick?: (event?: EventData) => void;
  selectedEventId?: string;
  setselectedLocation: any;
  onPlanEventCreateOrUpdateCallback: () => void;
}

export default function Events({
  poultryId,
  currentPlanId,
  data,
  eventType,
  showImages = true,
  showActionButton = true,
  showDivider = true,
  onClick,
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
  const [eventPlanForEdit, setEventPlanForEdit] = useState<PoultryPlanEvent>();
  // Toggle modal for Schedule event
  const [planEventModalToggle, setPlanEventModalToggle] = useState(false);

  const titleStyle = { display: 'flex', alignItems: 'center', gap: '16px' };
  const poultryDetailsEventCardStyle = (currentEventId: string) => ({
    ...titleStyle,
    justifyContent: 'space-between',
    padding: '24px 32px',
    marginBottom: eventType != PoultryEventType.Calendar ? '2px' : 'unset',
    cursor: 'pointer',
    '&:hover': {
      background: onClick ? `${theme.palette.primary.main}1F` : theme.palette.background.paper,
    },
    background:
      selectedrowid === currentEventId
        ? `${theme.palette.primary.main}14`
        : theme.palette.background.paper,
  });
  const contentStyle = { ...titleStyle, gap: '56px' };

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

  const getImageLinks = (eventData: PoultryEvent): string[] =>
    eventData?.photoRecords
      .map((record: PhotoRecord) => record.link)
      .filter((item: string) => !!item);

  const popScheduleEventEditModal = (event: any) => {
    // setting schedule event modal for edit (to pass as props for event plan)
    setEventPlanForEdit(event);

    // toggling modal to show
    setPlanEventModalToggle(true);
  };

  const onEventHandler = (e: any, event: EventData) => {
    const id = event?.id || event?._id;

    if (eventType === PoultryEventType.Submissions) changeRoute(`/submission/${id}`);
    if (eventType === PoultryEventType.Calendar) changeRoute(`/poultrybatch/${poultryId}/event/${id}`);
    if (eventType === PoultryEventType.Scheduled) {
      popScheduleEventEditModal(event);
    }
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
      {/*{eventPlanForEdit && (*/}
      {/*  <EventPlanModalHandler*/}
      {/*    action='put'*/}
      {/*    currentPlanId={currentPlanId}*/}
      {/*    eventPlan={eventPlanForEdit}*/}
      {/*    showToggle={planEventModalToggle}*/}
      {/*    setShowToggle={setPlanEventModalToggle}*/}
      {/*    onClose={hideEventPlanModal}*/}
      {/*    onCreateOrUpdateCallback={onPlanEventCreateOrUpdateCallback}*/}
      {/*  />*/}
      {/*)}*/}

      <If value={data?.length > 0}>
        {data?.map((cardData: EventData, index: number) => (
          <div key={`PoultryDetailsEvents${index}`}>
            <Paper sx={poultryDetailsEventCardStyle(cardData._id)} square={true} elevation={0}>
              <Box
                sx={titleStyle}
                onClick={() => {
                  {
                    eventType === PoultryEventType.Submissions &&
                      (setselectedLocation(cardData?.location), setSelectedrowid(cardData._id));
                  }
                }}
              >
                {eventType === PoultryEventType.Submissions && (
                  <Divider
                    orientation='vertical'
                    sx={{
                      background: '#6B6B6B',
                      width: '7px',
                      height: '38px',
                      borderRadius: '2px',
                    }}
                  />
                )}
                {eventType === PoultryEventType.Calendar && <CheckCircleRounded color='success' />}
                {eventType === PoultryEventType.Scheduled && (
                  <AccessTimeFilledIcon sx={{ color: 'pending.main' }} />
                )}
                <div
                  className='datashower'
                  style={{ width: eventType === PoultryEventType.Submissions ? '200px' : 'unset' }}
                >
                  {eventType !== PoultryEventType.Calendar && (
                    <Typography variant='h6'>{cardData.name}</Typography>
                  )}
                  {eventType === PoultryEventType.Calendar && (
                    <Typography variant='h6'>{cardData.details?.name}</Typography>
                  )}
                  {(eventType === PoultryEventType.Calendar ||
                    eventType === PoultryEventType.Submissions) && (
                      <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                        {cardData.createdBy?.name} •{' '}
                        {cardData.location?.lat && cardData.location?.lng
                          ? `Lat: ${cardData.location?.lat.toFixed(2)}º, Lng:
                     ${cardData.location?.lng.toFixed(2)}º • `
                          : ``}
                        {isoToLocal(cardData.createdAt)}
                      </Typography>
                    )}
                  {eventType === PoultryEventType.Scheduled && (
                    <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                      Period • Start Date: {cardData?.range?.start} - End Date:{' '}
                      {cardData?.range?.end}
                    </Typography>
                  )}
                </div>
              </Box>
              <Box sx={contentStyle}>
                {showImages && cardData.photoRecords && eventType !== PoultryEventType.Scheduled && (
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

                {showActionButton && (
                  <Box sx={titleStyle}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={(e) => onEventHandler(e, cardData)}
                    >
                      {eventType === PoultryEventType.Calendar
                        ? 'View Details'
                        : eventType === PoultryEventType.Submissions
                          ? 'Add Event'
                          : 'Edit'}
                    </Button>
                    {eventType === PoultryEventType.Submissions && (
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          setCardid(cardData);
                          return setShow(!show);
                        }}
                      >
                        View Details
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            </Paper>
            {showDivider &&
              eventType === PoultryEventType.Calendar &&
              data[data.length - 1] !== cardData && (
                <>
                  <Divider
                    orientation='vertical'
                    sx={{
                      background: '#4CAF50',
                      width: '2px',
                      height: '20px',
                      marginLeft: '42px',
                      zIndex: '20',
                      position: 'relative',
                    }}
                  />
                </>
              )}
          </div>
        ))}
      </If>
      {eventType === PoultryEventType.Submissions && show && (
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
