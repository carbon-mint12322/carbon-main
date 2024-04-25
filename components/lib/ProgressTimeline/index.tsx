import React, { useEffect, useState, MouseEvent } from 'react';
import dayjs from 'dayjs';
import moment from 'moment';
import Image from 'next/image';

import ReactCalendarTimeline, {
    ReactCalendarItemRendererProps,
    ReactCalendarGroupRendererProps,
    TimelineHeaders,
    SidebarHeader,
    DateHeader,
    CustomMarker,
    TimelineMarkers,
    TimelineItemBase,
    TimelineGroupBase,
} from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import { Box, Typography, Popover, Divider, Grid, IconButton, useTheme } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import ImageGroup from '~/components/ImageGroup';
import If from '~/components/lib/If';

import landPreparationImg from '../../../public/assets/images/icons/land_preparation.svg';
import cropInterventionImg from '../../../public/assets/images/icons/crop_intervention.svg';
import seedProcessingImg from '../../../public/assets/images/icons/seed_processing.svg';

import styles from './style.module.css';

import {
    CropProgress,
    CropPlanEvent,
    CropTimelineEventType,
} from '~/frontendlib/dataModel';
import { isoToLocal } from '~/utils/dateFormatter';
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import { has, set } from 'lodash';
import { PlanEventStatuses, PlanEventT } from '~/backendlib/types';
import { getDayJsMidnightISoString } from '~/frontendlib/utils/getDayJsMidnightISoString';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import {
    EntityEventTimelineData,
    ProgressTimelineProps,
    EntityEventTimelineGroup,
    IEventPlanEditModal,
    EntityEvent,
    ColorHexCode
} from './index.interface';
import { EntityEventPlanModalHandler } from '../EntityEventPlanModalHandler';


const keys = {
    groupIdKey: 'id',
    groupTitleKey: 'title',
    groupRightTitleKey: 'rightTitle',
    itemIdKey: 'id',
    itemTitleKey: 'name',
    itemDivTitleKey: 'title',
    itemGroupKey: 'group',
    itemTimeStartKey: 'start_time',
    itemTimeEndKey: 'end_time',
    groupLabelKey: 'name',
};


const ProgressTimeline = ({
    data,
    category = 'crop',
    onItemSelection = () => null,
    selectedEvent,
    isEntityCalendar = true,
    reFetch,
    EntityEventEditor
}: ProgressTimelineProps) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(null);
    const [event, setEvent] = useState<EntityEventTimelineData | null | undefined>(null);
    const [timelineItems, setTimelineItems] = useState<EntityEventTimelineData[]>([]);
    const [timelineGroups, setTimelineGroups] = useState<EntityEventTimelineGroup[]>([]);
    const { changeRoute } = useOperator();
    const [modalProps, setModalProps] = useState<IEventPlanEditModal>();
    const entityObjId = data.id

    useEffect(() => {
        if (data) {
            const { items, groups } = cropEventDataToCropEventTimelineDataFormatter(
                data,
                isEntityCalendar,
            );
            setTimelineItems(items);
            setTimelineGroups(groups);
        }
    }, [data]);

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setEvent(null);
    };

    const triggerEditModal = (currentEventItem: EntityEventTimelineData) => {
        // creating new instance
        const { currentPlanId, id: eventPlanId, group } = currentEventItem;
        if (group === 'actual') {
            changeRoute(`/${category}/${entityObjId}/event/${eventPlanId}`)
        }
        else {
            setModalProps({
                category,
                eventPlanModalHandler: data.eventPlanModalHandler,
                currentPlanId,
                eventPlanId: eventPlanId.toString(),
                time: new Date().getTime(),
                onPlanEventCreateOrUpdateCallback: reFetch,
                EntityEventEditor
            });
        }
    };

    const handleOnItemSelect = (itemId: string | number) => {
        const eventItem: EntityEventTimelineData[] = timelineItems?.filter((item) => item?.id === itemId);
        if (eventItem?.length) {
            // trigger edit modal
            triggerEditModal(eventItem[0]);

            //
            if (eventItem?.[0]?.details?.location) onItemSelection(eventItem[0]);
        }
    };

    const handleOnItemClick = () => {
        onItemSelection(undefined);
    };

    const open = Boolean(anchorEl);

    const eventImage = (eventType?: CropTimelineEventType, height = 24, width = 24) => {
        switch (eventType) {
            case CropTimelineEventType.LandPreparation:
                return (
                    <Image
                        layout='fixed'
                        src={landPreparationImg}
                        height={height}
                        width={width}
                        alt='cropImg'
                    />
                );
            case CropTimelineEventType.CropIntervention:
                return (
                    <Image
                        layout='fixed'
                        src={cropInterventionImg}
                        height={height}
                        width={width}
                        alt='cropImg'
                    />
                );
            case CropTimelineEventType.SeedProcessing:
                return (
                    <Image
                        layout='fixed'
                        src={seedProcessingImg}
                        height={height}
                        width={width}
                        alt='cropImg'
                    />
                );

            default:
                return null;
        }
    };
    const itemRenderer = ({
        item,
        itemContext,
        getItemProps,
    }: ReactCalendarItemRendererProps<EntityEventTimelineData>) => {
        const backgroundColor =
            selectedEvent?.id === item.id ? theme.palette.timeline.selectedEvent : item.bgColor;
        return (
            <Box
                {...getItemProps({
                    style: {
                        backgroundColor,
                        borderRadius: '6px',
                        border: 'unset !important',
                        padding: '0.7rem 0.4rem',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    },
                })}
                onMouseEnter={(event: MouseEvent<HTMLElement>) => {
                    if (item?.group == 'plan') {
                        setAnchorEl(event.currentTarget);
                        setEvent(item);
                    } else if (item?.details) {
                        setAnchorEl(event.currentTarget);
                        setEvent(item);
                    }
                }}
                onMouseLeave={() => {
                    setAnchorEl(null);
                }}
            >
                <If value={item.type}>
                    <Box
                        style={{
                            marginRight: '0.4rem',
                            height: 36,
                        }}
                    >
                        {eventImage(item.type)}
                    </Box>
                </If>

                <Typography
                    sx={{
                        fontFamily: 'stevie-sans',
                        fontStyle: 'normal',
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: theme.palette.common.black,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {itemContext.title}
                </Typography>
            </Box>
        );
    };

    const groupRenderer = ({
        group: { title, desc },
    }: ReactCalendarGroupRendererProps<EntityEventTimelineGroup>) => (
        <Box
            sx={{
                background: theme.palette.common.white,
                padding: '24px',
            }}
        >
            <Box
                sx={{
                    fontFamily: 'stevie-sans',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '17px',
                    color: theme.palette.common.black,
                }}
            >
                {title}
            </Box>
            <Box
                sx={{
                    fontFamily: 'stevie-sans',
                    fontStyle: 'normal',
                    fontWeight: 550,
                    fontSize: '12px',
                    lineHeight: '15px',
                    color: 'textSecondary',
                }}
            >
                {desc}
            </Box>
        </Box>
    );

    return (
        <Box
            sx={{
                // width: '89vw',
                p: 0,
            }}
        >
            <EventPlanEditModal {...modalProps} />
            {data && timelineGroups?.length > 0 && (
                <ReactCalendarTimeline
                    groups={timelineGroups}
                    items={timelineItems}
                    keys={keys}
                    sidebarContent={<div>Above The Left</div>}
                    itemTouchSendsClick={false}
                    stackItems
                    itemHeightRatio={0.6}
                    canChangeGroup={false}
                    canMove={false}
                    canResize={false}
                    defaultTimeStart={dayjs().add(-15, 'day').startOf('day').toDate()}
                    defaultTimeEnd={dayjs().add(15, 'day').startOf('day').toDate()}
                    groupRenderer={groupRenderer}
                    itemRenderer={itemRenderer}
                    buffer={1}
                    sidebarWidth={176}
                    lineHeight={84}
                    minResizeWidth={40}
                    minZoom={5 * 24 * 60 * 60 * 1000}
                    maxZoom={1 * 365.24 * 86400 * 1000}
                    timeSteps={{
                        second: 0,
                        minute: 0,
                        hour: 0,
                        day: 0,
                        month: 1,
                        year: 1,
                    }}
                    onItemClick={handleOnItemClick}
                    onItemSelect={handleOnItemSelect}
                    selected={selectedEvent?.id ? [selectedEvent?.id as number] : []}
                >
                    <TimelineHeaders
                        className={`sticky ${styles.calendarHeaderRoot}`}
                        calendarHeaderClassName={styles.calendarHeader}
                        style={{ zIndex: 100 }} // add this line to set a lower z-index
                    >
                        <SidebarHeader>
                            {({ getRootProps }) => {
                                return <Box {...getRootProps()}></Box>;
                            }}
                        </SidebarHeader>
                        <DateHeader unit='month' className={styles.timelineCalenderDateHeader} height={42} />
                    </TimelineHeaders>

                    <TimelineMarkers>
                        <CustomMarker date={dayjs().startOf('day').toDate()}>
                            {({ styles }) => {
                                const customStyles = {
                                    ...styles,
                                    backgroundColor: theme.palette.timeline.today,
                                    width: '3px',
                                    zIndex: 100, // Set higher than any other component
                                };
                                return (
                                    <Box sx={customStyles}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                background: theme.palette.timeline.today,
                                                borderRadius: '4px',
                                                color: theme.palette.common.white,
                                                padding: '2px 8px',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily: "'Stevie Sans'",
                                                    fontStyle: 'normal',
                                                    fontWeight: 600,
                                                    fontSize: '12px',
                                                    lineHeight: '15px',
                                                    width: '90px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Today {new Date().toDateString().slice(3, 10)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            }}
                        </CustomMarker>
                    </TimelineMarkers>
                </ReactCalendarTimeline>
            )}
            <Popover
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                {event?.group == 'plan' ? (
                    <Grid container direction='column'>
                        <Grid
                            container
                            item
                            sx={{
                                padding: '1rem',
                                fontFamily: 'stevie-sans',
                                fontStyle: 'normal',
                                fontWeight: 550,
                                fontSize: '14px',
                                lineHeight: '17px',
                                color: theme.palette.common.black,
                            }}
                            justifyContent={'center'}
                            alignItems={'left'}
                        >
                            <Grid item>
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        lineHeight: '20px',
                                        whiteSpace: 'nowrap',
                                    }}
                                    mb={1}
                                >
                                    {event?.name}
                                </Typography>
                                <Divider />
                                <Typography
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        opacity: 0.4,
                                    }}
                                >
                                    Start Date:{' '}
                                    {dayjs(`${new Date(event?.start_time)}`).format('DD MMM YYYY')}
                                </Typography>
                                <Typography
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        opacity: 0.4,
                                    }}
                                >
                                    End Date:{' '}
                                    {dayjs(`${new Date(event?.end_time)}`).format('DD MMM YYYY')}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container direction='column'>
                        <Grid
                            container
                            item
                            sx={{
                                padding: '1rem',
                                fontFamily: 'stevie-sans',
                                fontStyle: 'normal',
                                fontWeight: 550,
                                fontSize: '14px',
                                lineHeight: '17px',
                                color: theme.palette.common.black,
                            }}
                            justifyContent={'center'}
                            alignItems={'left'}
                        >
                            <Grid item>
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        lineHeight: '20px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {event?.details?.name}
                                </Typography>

                                <Typography
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        opacity: 0.4,
                                    }}
                                >
                                    {isoToLocal(event?.details?.createdAt || '')}
                                </Typography>
                            </Grid>
                        </Grid>
                        <If value={event?.details?.photoRecords?.length}>
                            <Divider />

                            <Grid
                                container
                                item
                                sx={{
                                    padding: '1.125rem 1.75rem',
                                }}
                            >
                                <ImageGroup ImagesList={event?.details?.photoRecords} maxImagesCount={4} />
                            </Grid>
                        </If>
                        <Divider />

                        <Grid
                            item
                            sx={{
                                padding: '1.5rem',
                            }}
                        >
                            <Typography
                                sx={{
                                    opacity: 0.4,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {event?.details?.createdBy?.name}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </Popover>
        </Box>
    );
};

export default ProgressTimeline;

const eventGroupData: {
    [key: string]: EntityEventTimelineGroup;
} = {
    plan: {
        id: 'plan',
        title: 'Plan',
        desc: 'Agreed during initiation.',
        color: '#FFCC80',
    },
    actual: {
        id: 'actual',
        title: 'Calendar',
        desc: 'Actual timeline of events.',
        color: '#A5D6A7',
    },
};

const cropEventDataToCropEventTimelineDataFormatter = (
    data: any,
    isEntityCalendar?: boolean,
): {
    items: EntityEventTimelineData[];
    groups: EntityEventTimelineGroup[];
} => {
    let timeLineData: EntityEventTimelineData[] = [];
    let groupData: EntityEventTimelineGroup[] = [];
    let progress: any;
    let currentPlanId: any;
    progress = data?.entityProgress;
    currentPlanId = data?.entityProgress?.plan.id;

    const cropProgressType: string[] = progress ? Object.keys(progress) : [];

    const getColorByStatusAndEventDate = ({
        event,
        defaultColor,
    }: {
        event: EntityEvent;
        defaultColor: ColorHexCode;
    }): ColorHexCode => {
        // if (has(event, 'range.start')) set(event, 'eventStatus', 'Pending')

        // colors for status
        const COLOR: { [key in 'Pending' | 'Completed' | 'Not Applicable']: ColorHexCode } = {
            Pending: '#FF7377',
            Completed: '#80B362',
            'Not Applicable': '#b4b4b4',
        };

        // check if this is crop plan event
        const isCropPlanEvent = (event: any): event is CropPlanEvent => {
            return has(event, 'range.start');
        };

        // if start date or status not valid then return defaultColor
        if (!isCropPlanEvent(event)) return defaultColor;

        // checking based on end date
        const eventDateRaw = event.range.end;

        // get event status
        const status = event.eventStatus ?? 'Pending';

        //
        const formattedDate =
            (eventDateRaw.split('/')?.length === 3 ? rearrangeDateDMYToYMD(eventDateRaw) : eventDateRaw) +
            'T00:00:00.000Z';

        // get event date days instance
        const eventDate = dayjs(formattedDate);

        const todayDate = dayjs(getDayJsMidnightISoString(dayjs()));
        // if event date is already passed,
        // then return the colors for specific statuses
        // Set the color to '#AAE6FF' for Pending events with ccp=false before the current date
        if (status === 'Pending' && !event.ccp && eventDate.isBefore(todayDate)) {
            return '#AAE6FF';
        }

        if (todayDate.isAfter(eventDate)) return COLOR[status];

        // if event date is after today, then return default color
        return defaultColor;
    };

    const getId = (event: EntityEvent, defaultId: `index-${string}`): string => {
        if (event?._id) return event?._id;

        return defaultId;
    };

    cropProgressType.forEach((group) => {
        if (!isEntityCalendar) {
            if (group !== 'actual') {
                groupData.push({
                    ...eventGroupData?.[group],
                });

                // Schedule event module
                progress?.[group as keyof CropProgress]?.events?.forEach(
                    (cropEvent: EntityEvent, index: number) => {
                        timeLineData.push({
                            name: cropEvent.name,
                            range: cropEvent.range,
                            details:
                                'details' in cropEvent && cropEvent?.details ? cropEvent?.details : undefined,
                            id: getId(cropEvent, `index-${index}`),
                            start_time: moment(cropEvent.range.start, 'DD/MM/YYYY').valueOf(),
                            end_time: moment(cropEvent.range.end, 'DD/MM/YYYY').valueOf(),
                            group: group,
                            bgColor: getColorByStatusAndEventDate({
                                event: cropEvent,
                                defaultColor: eventGroupData?.[group]?.color as ColorHexCode,
                            }),
                            canMove: false,
                            canResize: false,
                            canChangeGroup: false,
                            className: 'item-weekend',
                            currentPlanId,
                        });
                    },
                );
            }
        } else {
            groupData.push({
                ...eventGroupData?.[group],
            });

            const getColorByItemGroupType = ({
                event,
                group,
                defaultColor,
            }: {
                event: EntityEvent;
                group: string;
                defaultColor: ColorHexCode;
            }): ColorHexCode => {
                return group !== 'actual'
                    ? getColorByStatusAndEventDate({
                        event,
                        defaultColor,
                    })
                    : defaultColor;
            };

            // Crop progress module
            progress?.[group as keyof CropProgress]?.events?.forEach(
                (cropEvent: EntityEvent, index: number) => {
                    timeLineData.push({
                        name: group !== 'actual' ? cropEvent.name : cropEvent.details?.name || '',
                        range: cropEvent.range,
                        details: 'details' in cropEvent && cropEvent?.details ? cropEvent?.details : undefined,
                        id: getId(cropEvent, `index-${index}`),
                        start_time: moment(
                            cropEvent.range.start,
                            group !== 'actual' ? 'DD/MM/YYYY' : 'YYYY-MM-DD',
                        ).valueOf(),
                        end_time:
                            moment(
                                cropEvent.range.end,
                                group !== 'actual' ? 'DD/MM/YYYY' : 'YYYY-MM-DD',
                            ).valueOf() + 1,
                        group: group,
                        bgColor: getColorByItemGroupType({
                            group,
                            event: cropEvent,
                            defaultColor: eventGroupData?.[group]?.color as ColorHexCode,
                        }),
                        canMove: false,
                        canResize: false,
                        canChangeGroup: false,
                        className: 'item-weekend',
                        currentPlanId,
                    });
                },
            );
        }
    });

    return {
        items: timeLineData,
        groups: groupData,
    };
};

/** */
function EventPlanEditModal({
    category,
    eventPlanId,
    currentPlanId,
    onPlanEventCreateOrUpdateCallback = () => { },
    time,
    eventPlanModalHandler,
    EntityEventEditor
}: IEventPlanEditModal) {
    const { getApiUrl } = useOperator();
    const { openToast } = useAlert();

    //
    const [eventPlanForEdit, setEventPlanForEdit] = useState<CropPlanEvent | null>();

    // Toggle modal for Schedule event
    const [planEventModalToggle, setPlanEventModalToggle] = useState<boolean>(false);
    const [planIdCurr, setCurrPlanId] = useState<string | null>(null);
    const [eventPlanIdCurr, setCurrEventPlanId] = useState<string | null>(null);

    const resetModalProps = () => {
        setPlanEventModalToggle(false);
        setCurrEventPlanId(null);
        setCurrPlanId(null);
        setEventPlanForEdit(null);
    };

    // On true show pop up modal
    useEffect(() => {
        try {
            if (!currentPlanId) throw new Error('Plan Id from prop not valid.');
            if (!eventPlanId) throw new Error('Event Plan Id from prop not valid.');

            setPlanEventModalToggle(true);
            setCurrEventPlanId(eventPlanId);
            setCurrPlanId(currentPlanId);
        } catch (e) {
            if (time) openToast('error', (e as Error).message);
        }

        // On unmount set all to false
        return resetModalProps;
    }, [eventPlanId, currentPlanId, time]);

    // If eventPlantId is defined but eventPlan is undefined, fetch that and set it on eventPlan
    useEffect(() => {
        if (planEventModalToggle) {
            // Fetch event plan & set it
            fetch(getApiUrl(`/plan/${planIdCurr}/get/${eventPlanIdCurr}`))
                .then((r) => r.json())
                .then((json: any) => {
                    //
                    if (json?._id) setEventPlanForEdit(json);
                    //
                    else throw new Error('Event plan not valid.');
                })
                .catch((err) => {
                    console.error(err);
                    openToast('error', 'Error fetching Plan event.');
                });
        }
    }, [eventPlanIdCurr, planIdCurr, planEventModalToggle]);

    // hiding schedule event modal
    const hideEventPlanModal = () => {
        resetModalProps();
    };

    // on callback
    const callback = () => {
        onPlanEventCreateOrUpdateCallback();
        resetModalProps();
    };

    return (
        <>
            {eventPlanForEdit && planIdCurr && (
                <EntityEventPlanModalHandler
                    category={category}
                    action='put'
                    eventPlanModalHandler={eventPlanModalHandler}
                    currentPlanId={planIdCurr}
                    eventPlan={eventPlanForEdit}
                    showToggle={planEventModalToggle}
                    setShowToggle={setPlanEventModalToggle}
                    EntityEventEditor={EntityEventEditor}
                    onClose={hideEventPlanModal}
                    onCreateOrUpdateCallback={callback}
                />
            )}
        </>
    );
}
