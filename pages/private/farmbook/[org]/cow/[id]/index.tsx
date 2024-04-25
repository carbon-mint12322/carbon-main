import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useAlert } from '~/contexts/AlertContext';

import Dialog from '~/components/lib/Feedback/Dialog';
import EntityProgress from '~/components/lib/EntityProgress';


import { Box, Typography, useTheme, SxProps } from '@mui/material';

import OverviewTab from '~/container/landparcel/details/OverviewTab';

import Tabs from '~/components/lib/Navigation/Tabs';
import {
  CalendarBlank,
  ChartLine,
  Cube,
  DownloadSimple,
  Files,
  Layout,
  Leaf,
  Person,
  Ruler,
} from '~/components/Icons';
import Donut from '~/components/common/Chart/Donut';
import
getScheduledEventsData
  from "~/entitylib/functions/getData/getScheduledEventsData";

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import cowImg from '../../../../../../public/assets/images/crop.svg';
import mapStyles from '~/styles/theme/map/styles';

import { PageConfig, Cow, CowEvent } from '~/frontendlib/dataModel';
import { coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';

import NestedDocument from '~/components/lib/NestedResources/NestedDocument'
import { stringDateFormatter } from '~/utils/dateFormatter';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';
import ScheduledEvents from '~/components/lib/ScheduledEvents';
import axios from 'axios';
import { EventPlanModalHandler } from '~/container/crop/plan/EventPlan';
import { log } from 'console';
import CropProgress from '~/container/crop/details/cropProgress';

export { default as getServerSideProps } from '~/utils/ggsp';

const supportingDocumentsEditor = dynamic(
  import('~/gen/data-views/supportingDocuments/supportingDocumentsEditor.rtml'),
);

const Add_cowEditor = dynamic(import('~/gen/data-views/add_cow/add_cowEditor.rtml'));

export interface CowDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Cow;
}

interface LactationPeriod {
  startDate: string;
  endDate: string;
  status: 'Active' | 'Complete';
  dailyProduction: {
    date: string;
    milkProduced: number;
  }[];
  averageDailyMilk: number;
  totalMilkProduced: number;
}

export default function CowDetails(props: any) {
  const { openToast } = useAlert();
  const router = useRouter();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const { changeRoute, getAPIPrefix, getApiUrl } = useOperator();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    mainBtnTitle: 'Add Event',
    subBtnTitle: 'Schedule Event',
    subBtnColor: 'secondary',
    titleIcon: cowImg.src,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isTitleIconPresent: true,
  });
  const API_URL = `${getAPIPrefix()}/cow/${router.query.id}`;

  const cowId = router?.query?.id;

  const { isLoading: loading, data, reFetch } = useFetch<Cow[]>(API_URL);

  const cowData = data?.[0];

  // Updating plan id on cow data change
  const [currentPlanId, setCurrentPlanId] = useState<string | undefined>();

  React.useEffect(() => {
    // Find the active plan, if not exists then return the first plan in array
    const getActivePlanId = (cowData: Cow | undefined) => {
      let plan = null,
        err = '';

      try {
        if (!cowData) {
          throw new Error('Cow Data not available');
        }

        const activePlan = cowData.plan.find((item) => {
          return item.status.toLowerCase() === 'active';
        });

        plan = activePlan || cowData.plan[0];

        if (plan && plan._id) {
          return plan._id;
        }

        throw new Error('Plan not found.');
      } catch (e) {
        if (e instanceof Error) {
          err = e.message;
          console.error(err);
        }
      }
    };

    setCurrentPlanId(getActivePlanId(cowData));
  }, [cowData]);

  /** On Schedule event **/

  // State management for Event plan modal
  const [planEventModalToggle, setPlanEventModalToggle] = useState(false);

  // Closes Event plan model
  const hideEventPlanModal = () => {
    setPlanEventModalToggle(false);
  };

  /**
   *  It Opens a popup for user to create a new event plan
   * */
  const onScheduleEventClick = () => {
    setPlanEventModalToggle((prevState) => !prevState);
  };

  React.useEffect(() => {
    if (cowData) {
      setTitleBarData({
        ...titleBarData,
        title: cowData?.tagId,
        subTitle: cowData?.landParcel?.name,
        isMainBtnPresent: cowData?.status !== 'Completed',
        isSubBtnPresent: cowData?.status !== 'Completed',
      });
    }
  }, [cowData]);

  const cowDetails = {
    id: cowData?.id,
    name: cowData?.tagId,
    landParcel: cowData?.landParcel?.name,
    fieldId: cowData?.fieldDetails?.[0]?.fbId,
    farmer: {
      id: cowData?.farmer?.id,
      name: cowData?.farmer?.name,
    },
    landParcelMap: cowData?.landParcelDetails?.[0]?.map,
    fieldMap: cowData?.fieldDetails?.[0]?.map,
    location: cowData?.fieldDetails?.[0]?.location,
    entityProgress: cowData?.entityProgress,
  };

  // Function to check if today is within an active lactation period
  const isActiveLactationPeriod = (period: LactationPeriod): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return period.status === 'Active' && today >= period.startDate && today <= period.endDate;
  };

  // Iterate through lactation periods to find the active period
  const activeLactationPeriod = cowData?.lactationPeriods?.find(isActiveLactationPeriod);



  const overviewData = {
    id: cowData?.id,
    name: cowData?.tagId,
    landParcel: cowData?.landParcel?.name,
    fieldId: cowData?.fieldDetails?.[0]?.fbId,
    farmer: {
      id: cowData?.farmer?.id,
      name: cowData?.farmer?.name,
    },
    age: cowData?.age,
    breed: cowData?.breed,
    source: cowData?.cowSource,
    pedigree: cowData?.pedigree,
    gender: cowData?.gender,
    acquisitionDay: cowData?.acquisitionDay,
    tagId: cowData?.tagId,
    lactionaPeriodDays: cowData?.lactionaPeriodDays,
    averageMilkProduction: cowData?.averageMilkProduction,
    polygons: [
      {
        paths: coordinateStringToCoordinateObject(cowDetails?.fieldMap || ''),
        options: { ...mapStyles.fieldMap },
      },
    ],
    landPolygon: {
      paths: coordinateStringToCoordinateObject(cowDetails?.landParcelMap || ''),
      options: { ...mapStyles.landParcelMap },
    },
  };

  const handleClose = () => {
    setOpenModal(null);
  };

  const overviewDataList = [
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Gender',
      value: overviewData.gender,
    },
    {
      icon: <CalendarBlank color={theme.palette.iconColor.default} />,
      title: 'Age (Days)',
      value: overviewData.age,
    },
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Breed',
      value: overviewData.breed,
    },
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Source',
      value: overviewData.source,
    },
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Tag ID',
      value: overviewData.tagId,
    },
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Pedigree',
      value: overviewData.pedigree,
    },
    {
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      title: 'Acquisition Day',
      value: stringDateFormatter(overviewData?.acquisitionDay?.toString() || ''),
    },

    {
      icon: <Person color={theme.palette.iconColor.primary} />,
      title: 'Farmer',
      value: overviewData.farmer?.name,
    }

  ];

  if (overviewData.gender === 'Female') {
    overviewDataList.push({
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      title: 'Lactation Period (Days)',
      value: overviewData.lactionaPeriodDays,
    });
    overviewDataList.push({
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      title: 'Average Milk Production (Litres)',
      value: overviewData.averageMilkProduction,
    });
  }

  function fetchData() {
    return reFetch(API_URL);
  }

  if (activeLactationPeriod) {
    overviewDataList.push({
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Actve Lactation Period',
      value: 'Yes',
    });
    overviewDataList.push({
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      title: 'Lactation Period Start Date',
      value: stringDateFormatter(activeLactationPeriod?.startDate?.toString() || ''),
    });
    overviewDataList.push({
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      title: 'Lactation Period End Date',
      value: stringDateFormatter(activeLactationPeriod?.endDate?.toString() || ''),
    });

  } else {
    overviewDataList.push({
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Actve Lactation Period',
      value: 'No',
    });
  }



  const handleAddFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/cow/${router.query.id}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Cow details updated');
          setOpenModal(null);
        });

      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update cow details');
      console.log(error);
    }
  };
  const handleEditCowFormSubmit = async (formData: any) => {
    try {
      delete formData._id;
      const apiUrl = getApiUrl(`/cow/${router.query.id}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Cow details updated');
          setOpenModal(null);
        });

      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update cow details');
      console.log(error);
    }
  };

  const labelList = [
    {
      label: 'Overview',
      icon: <Cube color={theme.palette.iconColor.default} />,
    },
    {
      label: 'Events',
      icon: <ChartLine color={theme.palette.iconColor.primary} />,
    },
    {
      label: 'Scheduled Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      count: cowData?.plan[0]?.events?.length ?? 0,
    },
    {
      label: 'Documents',
      icon: <Files color={theme.palette.iconColor.default} />,
    },
  ];

  const onPlanEventCreateOrUpdateCallback = () => {
    reFetch(API_URL);
  };

  const componentList = [
    {
      component: OverviewTab,
      props: {
        data: overviewData,
        overviewDataList: overviewDataList,
        showMainButton: true,
        mainButtonTitle: 'Edit Cow Details',
        handleMainBtnClick: () => setOpenModal('editCow'),
        kmlString: cowData?.fieldDetails?.[0]?.map,
        kmlName: cowData?.landParcel?.name,
      },
    },
    {
      label: 'Cow Progress',
      icon: <ChartLine color={theme.palette.iconColor.primary} />,
      component: EntityProgress,

      props: {
        data: cowDetails,
        entity: 'cow',
        category: 'cow',
        eventData: {
          data: cowData?.events.filter((event: CowEvent) => event.category === 'Cow'),
          eventType: 'Calendar',
        },
        reFetch: () => reFetch(API_URL),
      },
    },

    {
      label: 'Scheduled Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      count: cowData?.plan[0]?.events?.length ?? 0,
      component: ScheduledEvents,
      props: {
        ...getScheduledEventsData(cowData, 'cow', fetchData),
      },
    },

    {
      component: NestedDocument,
      props: {
        data: cowData,
        reFetch: () => reFetch(API_URL),
        childResourceUri: 'documents',
        modelName: 'cow'
      },
    },
  ];


  async function productionSystemFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/productionsystem`);

    // Filter the data array based on the productionSystemId
    const filteredData = res.data.filter((productionSystemDetails: any) => productionSystemDetails.landParcel === data?.[0].landParcel?.id && productionSystemDetails.category === 'Dairy');

    return filteredData;
  }

  const formContext: any = {
    foreignObjectLoader: productionSystemFilter,
  };

  const renderModal = () => {
    switch (openModal) {
      case 'editCow':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <Add_cowEditor
              formData={{
                data: cowData,
              }}
              onSubmit={handleEditCowFormSubmit}
              formContext={formContext}
            />
          </Dialog>
        );

      default:
        return null;
    }
  };



  return (
    <CircularLoader value={loading}>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleMainBtnClick={() => {
          changeRoute(`/cow/${cowId}/create-event`);
        }}
        handleSubBtnClick={onScheduleEventClick}
      />
      <EventPlanModalHandler
        currentPlanId={currentPlanId}
        category={'cow'}
        showToggle={planEventModalToggle}
        setShowToggle={setPlanEventModalToggle}
        onClose={hideEventPlanModal}
        action='post'
        onCreateOrUpdateCallback={onPlanEventCreateOrUpdateCallback}
      />
      <Tabs
        labelList={labelList}
        componentList={componentList}
        headerContent={
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Donut
              color={theme.palette.chart.primary}
              series={[cowData?.climateScore || 0, 100 - (cowData?.climateScore || 0)]}
            />
            <Box>
              <Typography color='textPrimary' variant='body1' fontWeight={550}>
                {cowData?.climateScore} %
              </Typography>
              <Typography color='textSecondary' variant='caption' fontWeight={400}>
                Climate Impact Score
              </Typography>
            </Box>
            <Donut
              color={theme.palette.chart.secondary}
              series={[cowData?.complianceScore || 0, 100 - (cowData?.complianceScore || 0)]}
            />
            <Box>
              <Typography color='textPrimary' variant='body1' fontWeight={550}>
                {cowData?.complianceScore || 0} %
              </Typography>
              <Typography color='textSecondary' variant='caption' fontWeight={400}>
                Compliance Score
              </Typography>
            </Box>
          </Box>
        }
      />
      {renderModal()}{' '}
    </CircularLoader>
  );
}
