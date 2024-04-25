import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Dialog from '~/components/lib/Feedback/Dialog';
import CardView from '~/components/ui/CardView';
import { Box, Grid, Button, Divider, IconButton, Typography, Paper, useTheme } from '@mui/material';

import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';


import ImageGroup from '../../../components/ImageGroup';
import If from '~/components/lib/If';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';
import { useEventCxt } from '~/contexts/EventContext';
import { isoToLocal } from '~/utils/dateFormatter';
import { getFileUrl } from '~/frontendlib/util';
import { EntityEventPlanModalHandler } from '../EntityEventPlanModalHandler';
import { EntityEvent, EntityEventData, EntityEventType, EntityEventsProps, EntityPlanEvent, PhotoRecord } from './index.interface';
// import { EventPlanModalHandler } from '../plan/EventPlan';



export default function EntityEvents({
    entityId,
    entity,
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
    allowAddEvent = true,
    EntityEventEditor
}: EntityEventsProps) {
    const router = useRouter();
    const theme = useTheme();
    const [show, setShow] = useState(false);
    const [cardid, setCardid] = useState<EntityEventData>();
    const { changeRoute, getAPIPrefix } = useOperator();
    const { setImages, setDocuments, setAudio, setNotes, clearState } = useEventCxt();
    const [loading, setLoading] = useState<boolean>(true);
    const query = router.query;
    const [selectedrowid, setSelectedrowid] = useState<string>(
        selectedEventId ? selectedEventId : data?.[0]?._id,
    );

    const domain = window.location.hostname ? window.location.hostname : 'localhost';

    // variable to set selected scheduled event for edit
    const [eventPlanForEdit, setEventPlanForEdit] = useState<EntityPlanEvent>();
    // Toggle modal for Schedule event
    const [planEventModalToggle, setPlanEventModalToggle] = useState(false);

    const titleStyle = { display: 'flex', alignItems: 'center', gap: '16px' };
    const entityDetailsEventCardStyle = (currentEventId: string) => ({
        ...titleStyle,
        justifyContent: 'space-between',
        padding: '24px 32px',
        marginBottom: eventType != EntityEventType.Calendar ? '2px' : 'unset',
        cursor: 'pointer',
        '&:hover': {
            background:
                selectedrowid === currentEventId
                    ? `${theme.palette.primary.main}1F`
                    : theme.palette.background.paper,
        },
        background:
            selectedrowid === currentEventId
                ? `${theme.palette.primary.main}14`
                : theme.palette.background.paper,
    });
    const contentStyle = { ...titleStyle, gap: '56px' };

    const shuffle = (array: any) => {
        let currentIndex = array?.length,
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

    const getImageLinks = (eventData: EntityEvent): string[] =>
        eventData?.photoRecords
            .map((record: PhotoRecord) => getFileUrl(record.link, domain))
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
    const getApiData = async (): Promise<{ data: any }> => {
        try {
            setLoading(true);
            const res: {
                data: any;
            } = await axios.get(getAPIPrefix() + `/event/${selectedrowid}`);
            res.data?.photoRecords && setImages(res.data?.photoRecords || []);
            res.data?.document && setDocuments(res.data?.document || []);
            res.data?.audioRecords && setAudio(res.data?.audioRecords || []);
            res.data?.notes && setNotes([res.data]);
            return { data: res?.data || {} };
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        return { data: {} };
    };
    const onEventHandler = (e: any, event: EntityEventData) => {
        const id = event?.id || event?._id;

        if (event.category == 'Production System') {
            changeRoute(`/productionsystem/${router.query.id}/event/${id}`);
            return;
        }
        if (event.category == 'Processing System') {
            changeRoute(`/processingsystem/${router.query.id}/event/${id}`);
            return;
        }
        if (eventType === EntityEventType.Submissions) {
            if (event?.name === 'Land Parcel Intervention') {
                changeRoute(`/landparcel/${router.query.id}/create-event`);
            } else if (event?.name === 'Processing System Intervention') {
                changeRoute(`/processingsystem/${router.query.id}/create-event`);
            } else if (event?.name === 'Production System Intervention') {
                changeRoute(`/productionsystem/${router.query.id}/create-event`);
            } else {
                changeRoute(`/crop/${router.query.id}/create-event`);
            }
        }
        if (eventType === EntityEventType.Calendar)
            changeRoute(`/${entity}/${entityId}/event/${id}`)
        if (eventType === EntityEventType.Scheduled) {
            popScheduleEventEditModal(event);
        }
    };
    const handleOnItemClick = (cardData: EntityEventData) => {
        if (cardData._id !== selectedEventId) {
            onClick && onClick(cardData);
        } else {
            onClick && onClick(undefined);
        }
    };
    const responsiveCard = { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 };

    useEffect(() => {
        getApiData();
    }, [query]);

    // hiding schedule event modal
    const hideEventPlanModal = () => setPlanEventModalToggle(false);
    return (
        <>
            {eventPlanForEdit && (
                <EntityEventPlanModalHandler
                    action='put'
                    currentPlanId={currentPlanId}
                    eventPlan={eventPlanForEdit}
                    showToggle={planEventModalToggle}
                    setShowToggle={setPlanEventModalToggle}
                    onClose={hideEventPlanModal}
                    onCreateOrUpdateCallback={onPlanEventCreateOrUpdateCallback}
                    EntityEventEditor={EntityEventEditor}
                />
            )}

            {(entityId && eventType === EntityEventType.Calendar) && (
                <Grid minHeight={60} px='2.5' container justifyContent='space-between' alignItems='center'>
                    <If value={data?.length === 0}>
                        <Typography fontWeight='bold'>No Events</Typography>
                    </If>
                    <If value={data?.length > 0}>
                        <Typography fontWeight='bold'>Events ({data?.length})</Typography>
                    </If>
                    <Grid item>
                        <If value={allowAddEvent}>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                size={'small'}
                                onClick={() => {
                                    clearState();
                                    entityId && changeRoute(`/${entity}/${entityId}/create-event`);
                                }}
                            >
                                Add Event
                            </Button>
                        </If>
                    </Grid>
                </Grid>
            )}

            <If value={data?.length > 0}>
                {data?.map((cardData: EntityEventData, index: number) => {
                    eventType = getEventType(eventType, cardData.category);
                    return (
                        <div key={`EntityDetailsEvents${index}`}>
                            <Paper sx={entityDetailsEventCardStyle(cardData._id)} square={true} elevation={0}>
                                <Box
                                    sx={titleStyle}
                                    onClick={() => {
                                        onClick(cardData), setSelectedrowid(cardData._id);
                                    }}
                                >
                                    {eventType === EntityEventType.Submissions && (
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
                                    {eventType === EntityEventType.Calendar && <CheckCircleRounded color='success' />}
                                    {eventType === EntityEventType.Scheduled && (
                                        <AccessTimeFilledIcon sx={{ color: 'pending.main' }} />
                                    )}
                                    <div
                                        className='datashower'
                                        style={{ width: eventType === EntityEventType.Submissions ? '300px' : 'unset' }}
                                    >
                                        {eventType !== EntityEventType.Calendar && (
                                            <Typography variant='h6'>{cardData.name}</Typography>
                                        )}
                                        {eventType === EntityEventType.Calendar && (
                                            <Typography variant='h6'>{cardData.details?.name}</Typography>
                                        )}
                                        {(eventType === EntityEventType.Calendar ||
                                            eventType === EntityEventType.Submissions) && (
                                                <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                                                    {cardData.createdBy?.name} •{' '}
                                                    {cardData.location?.lat && cardData.location?.lng
                                                        ? `Lat: ${cardData.location?.lat.toFixed(2)}º, Lng:
                     ${cardData.location?.lng.toFixed(2)}º • `
                                                        : ``}
                                                    {isoToLocal(cardData.createdAt)}
                                                </Typography>
                                            )}
                                        {eventType === EntityEventType.Scheduled && (
                                            <Typography variant='subtitle2' sx={{ opacity: '0.6' }}>
                                                Period • Start Date: {cardData?.range?.start} - End Date:{' '}
                                                {cardData?.range?.end}
                                            </Typography>
                                        )}
                                    </div>
                                </Box>
                                <Box sx={contentStyle}>
                                    {showImages && cardData.photoRecords && eventType !== EntityEventType.Scheduled && (
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
                                                id={
                                                    eventType === EntityEventType.Calendar
                                                        ? 'View Details'
                                                        : eventType === EntityEventType.Submissions
                                                            ? 'Add Event'
                                                            : 'Edit'
                                                }
                                                variant='contained'
                                                color='primary'
                                                onClick={(e) => onEventHandler(e, cardData)}
                                            >
                                                {eventType === EntityEventType.Calendar
                                                    ? 'View Details'
                                                    : eventType === EntityEventType.Submissions
                                                        ? 'Add Event'
                                                        : 'Edit'}
                                            </Button>
                                            {eventType === EntityEventType.Submissions && (
                                                <Button
                                                    id='viewDetailsButton'
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
                                eventType === EntityEventType.Calendar &&
                                data[data?.length - 1] !== cardData && (
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
                    );
                })}
            </If>
            <If value={data?.length === 0 && eventType === EntityEventType.Submissions}>
                <Typography fontWeight='bold'>No Submissions</Typography>
            </If>
            {eventType === EntityEventType.Submissions && show && (
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
        </>
    );
}
