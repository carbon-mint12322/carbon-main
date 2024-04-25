import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Grid, Modal, Paper, Select, Tooltip, Typography } from '@mui/material';
import Events, { EventData, EventsProps } from '../Events';
import PoultryEvents, {
  EventData as PoultryEventData,
  EventsProps as PoultryEventsProps,
} from '../../../poultry/details/Events';
import AquaCropEvents, { EventData as AquaCropEventData } from '../../../aquacrop/details/Events';
import { Coordinate } from '~/utils/coordinatesFormatter';
import { CropProgress as CropProgressParams, Farmer } from '~/frontendlib/dataModel';
import {
  CropPlanEvent,
  ScheduledEvents as ScheduledEventsParams,
} from '~/frontendlib/dataModel/crop';
import CropsTimeline, { CropEventTimelineData } from '../cropProgress/CropTimeline';
import { useAlert } from '~/contexts/AlertContext';
import { EventPlanModalHandler } from '~/container/crop/plan/EventPlan';
import axios from 'axios';
import router from 'next/router';
import { useOperator } from '~/contexts/OperatorContext';
import { CircularLoader } from '@carbon-mint/ui-components';
import {
  GridRowParams,
  GridColDef,
  DataGrid,
  GridSelectionModel,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import CustomFooter from '~/components/CustomFooter';
import useFetch from 'hooks/useFetch';
import globalStyles from '~/styles/theme/brands/styles';
import EventNameCell from '~/components/EventsName';
import ListActionModal from '~/components/lib/ListActionModal';
import ScheduledEventsEditForm from '~/container/crop/details/ScheduledEvents/edit/index';
import PlanEventEditor from '~/gen/data-views/planEvent/planEventEditor.rtml.jsx';

import { CropEventType } from '~/frontendlib/dataModel';

export interface CropData {
  id: string;
  name: string;
  landParcel: string;
  croppingSystem: string;
  startDate: string;
  farmer: Farmer;
  landParcelMap: string;
  fieldMap: string;
  areaInAcres: number;
  estimatedYieldTones: number;
  plannedSowingDate: string;
  estHarvestDate: string;
  category: string;
  cropProgress: CropProgressParams;
  scheduledEvents: ScheduledEventsParams;
  location?: Coordinate;
}
interface ScheduledEventsProps {
  data: any;
  category: string;
  eventData: EventsProps;
  currentPlanId: string | undefined;
  onPlanEventCreateOrUpdateCallback: () => void;
  reFetch?: () => void;
  eventType?: CropEventType | string;
  planIdCurr: string | undefined;
}

const styles = {
  paper: {
    height: '100%',
    p: 1,
  },
  select: {
    width: '100%',
    marginTop: '8px',
    fontSize: '16px',
    padding: '10px',
    borderRadius: '8px',
    borderColor: '#d9d4d4',
    border: '1px solid',
  },
  option: {
    width: '100%',
    margin: '4px 0',
  },
  modalBoxStyles: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxHeight: '85%',
    bgcolor: 'background.paper',
    border: '1px solid #EFEFEF',
    borderRadius: '8px',
    boxShadow: 24,
    p: 2,
  },
  eventNameCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
  eventNameCellSubtitle: { color: 'text.disabled', wordWrap: 'break-word' },
  renderActionCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
  cropChip: {
    background: '#F1F1F1',
    color: 'textPrimary',
  },
  cropChipIcon: {
    color: 'iconColor.default',
  },
};

export default function ScheduledEvents({
  data,
  category,
  eventData,
  currentPlanId,
  onPlanEventCreateOrUpdateCallback,
  reFetch = () => { },
  eventType,
  planIdCurr,
}: ScheduledEventsProps) {
  const { openToast } = useAlert();
  const [selectedItemEvent, setSelectedItemEvent] = useState<
    EventData | PoultryEventData | AquaCropEventData | null
  >();
  const [selectedEvent, setSelectedEvent] = useState<CropEventTimelineData>();
  const [planEventModalToggle, setPlanEventModalToggle] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const { changeRoute, getAPIPrefix, getApiUrl } = useOperator();
  const API_URL = `${getAPIPrefix()}/crop/${router.query.id}`;
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [showInactive, setShowInactive] = useState(false);
  const [updateInprogress, setUpdateInprogress] = React.useState<Boolean>(false);
  const { isLoading: loading } = useFetch<any>(API_URL);
  const [eventPlanForEdit, setEventPlanForEdit] = useState<CropPlanEvent>();

  const handleStatusChange = async () => {
    try {
      setUpdateInprogress(true);
      await axios
        .put(getApiUrl(`/plan/${currentPlanId}/update/events`), {
          eventPlanIds: selectionModel,
          payload: { eventStatus: selectedStatus },
        })
        .then((res) => {
          openToast('success', 'Event details updated');
          setShowStatusModal(false);
          setSelectedStatus('');
          setSelectionModel([]);
          reFetch();
        });
    } catch (error) {
      console.error('Error updating event status:', error);
      throw new Error('Error updating event status');
    } finally {
      setUpdateInprogress(false);
    }
  };

  const handleOnItemSelection = (eventItem?: CropEventTimelineData) => {
    setSelectedEvent(eventItem);
    setSelectedItemEvent(null);
  };

  React.useEffect(() => {
    setShowInactive(!selectionModel.length || !!updateInprogress);
  }, [selectionModel, updateInprogress]);

  React.useEffect(() => {
    setShowInactive(!selectionModel.length || !!updateInprogress);
  }, [selectionModel, updateInprogress]);

  const handleOnEventClick = (
    eventItem?: EventData | PoultryEventData | AquaCropEventData | null,
  ) => {
    setSelectedItemEvent(eventItem);
    setSelectedEvent(undefined);
  };

  const hideEventPlanModal = () => {
    setPlanEventModalToggle(false);
  };

  const onScheduleEventClick = () => {
    setPlanEventModalToggle((prevState) => !prevState);
  };

  const handleActivation = () => {
    reFetch && reFetch();
  };

  const searchData = useMemo(() => {
    const rowData = eventData?.data?.map((obj) => {
      return { ...obj, id: obj._id };
    });
    return rowData;
  }, [eventData.data]);

  const popScheduleEventEditModal = (event: any) => {
    // setting schedule event modal for edit (to pass as props for event plan)
    setEventPlanForEdit(event);

    // toggling modal to show
    setPlanEventModalToggle(true);
  };

  const onEventHandler = (e: any, event: EventData) => {
    const id = event?.id || event?._id;
    if (eventType === CropEventType.Scheduled) {
      popScheduleEventEditModal(event);
    }
  };

  const renderEventsCell = (data: any) => {
    data.row = { ...data?.row, planId: currentPlanId, category: category };
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data?.row?.active}
          id={data?.row?._id}
          schema={'event'}
          data={data?.row}
          reFetch={reFetch}
          Editor={ScheduledEventsEditForm}
          canActivate={false}
          canEdit={true}
          canDelete={false}
          onClick={(e) => onEventHandler(e, data)}
        />
      </Box>
    );
  };

  const renderEventNameCell = (data: any) => {
    return (
      <span>
        <EventNameCell
          title={
            data?.row?.name.length > 17
              ? `${data?.row?.name.substring(0, 16)}..`
              : data?.row?.name.substring(0, 17)
          }
          subTitle={
            data?.row?.landParcel?.name?.length > 17
              ? `${data?.row?.landParcel?.name?.substring(0, 16)}..`
              : data?.row?.landParcel?.name?.substring(0, 17)
          }
          sx={styles.eventNameCell}
          subTitleSx={styles.eventNameCellSubtitle}
        />
      </span>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Events Name',
      minWidth: 220,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row?.name}`,
      renderCell: renderEventNameCell,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      minWidth: 220,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row?.range?.start}`,
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      minWidth: 220,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row?.range?.end}`,
    },
    {
      field: 'eventStatus',
      headerName: 'Event Status',
      minWidth: 220,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row?.eventStatus}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 100,
      flex: 1,
      renderCell: renderEventsCell,
    },
  ];

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Not Applicable', label: 'Not Applicable' },
  ];

  return (
    <Grid container direction='row' rowSpacing={3} columnSpacing={4}>
      {
        <EventPlanModalHandler
          currentPlanId={currentPlanId}
          category={category}
          eventPlan={eventPlanForEdit}
          showToggle={planEventModalToggle}
          setShowToggle={setPlanEventModalToggle}
          onClose={hideEventPlanModal}
          action='post'
          onCreateOrUpdateCallback={onPlanEventCreateOrUpdateCallback}
        />
      }
      <Grid item xs={12} container justifyContent='flex-end'>
        <Button
          variant={'contained'}
          color={'primary'}
          size={'medium'}
          onClick={onScheduleEventClick}
        >
          Schedule Event
        </Button>
        <Button
          variant={'contained'}
          color={'info'}
          size={'medium'}
          onClick={() => setShowStatusModal(true)}
          style={{ margin: ' 0 10px' }}
          disabled={showInactive}
        >
          Change Status
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={0} sx={styles.paper}>
          <CropsTimeline
            isCropCalendar={false}
            category={category}
            data={data}
            onItemSelection={handleOnItemSelection}
            selectedEvent={selectedEvent}
            reFetch={reFetch}
          />
        </Paper>
      </Grid>

      <Grid item xs={12} container justifyContent='flex-end'>
        <Modal
          open={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          aria-labelledby='change-status-modal'
          aria-describedby='change-status-description'
        >
          <Box sx={styles.modalBoxStyles}>
            <Typography fontWeight={600} id='change-status-modal'>
              Select Status
            </Typography>
            <Box sx={{ mt: 2 }}>
              <select
                id='change-status-modal'
                value={selectedStatus}
                style={styles.select}
                placeholder='Select Status'
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value} style={styles.option}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Box sx={{ mt: 2 }}>
                <Button variant='contained' color='primary' onClick={handleStatusChange}>
                  {updateInprogress ? 'Submitting..' : 'Submit'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Grid>

      <Grid item xs={12}>
        {category === 'poultry' ? (
          <PoultryEvents
            {...eventData}
            currentPlanId={currentPlanId}
            onClick={handleOnEventClick}
            selectedEventId={selectedItemEvent?._id}
            onPlanEventCreateOrUpdateCallback={onPlanEventCreateOrUpdateCallback}
          />
        ) : category === 'aquacrop' ? (
          <AquaCropEvents
            {...eventData}
            currentPlanId={currentPlanId}
            onClick={handleOnEventClick}
            selectedEventId={selectedItemEvent?._id}
            onPlanEventCreateOrUpdateCallback={onPlanEventCreateOrUpdateCallback}
          />
        ) : (
          <Paper elevation={0}>
            <CircularLoader value={loading}>
              <Box style={globalStyles.dataGridLayer}>
                <DataGrid
                  {...eventData}
                  onSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                  }}
                  getRowId={(row) => row?.id}
                  // onRowClick={(params: GridRowParams) => handleRowClick(params)}
                  selectionModel={selectionModel}
                  columns={columns}
                  rows={searchData || []}
                  disableColumnSelector={false}
                  checkboxSelection
                  isRowSelectable={(params: GridRowParams) => true}
                  rowHeight={64}
                  disableSelectionOnClick={false}
                  sx={globalStyles.datagridSx}
                  components={{
                    Footer: CustomFooter,
                  }}
                  componentsProps={{
                    footer: {
                      active: !showInactive,
                      showActiveSwitch: false,
                      onSwitchClick: () => setShowInactive(!showInactive),
                    },
                  }}
                />
              </Box>
            </CircularLoader>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}
