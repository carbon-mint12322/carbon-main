import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useAlert } from '~/contexts/AlertContext';

import Dialog from '~/components/lib/Feedback/Dialog';

import { Box, Typography, useTheme, SxProps } from '@mui/material';
import FarmerSubmission from '~/container/crop/details/FarmerSubmission';

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
import EntityProgress from '~/components/lib/EntityProgress';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import sheepImg from '../../../../../../public/assets/images/crop.svg';
import mapStyles from '~/styles/theme/map/styles';

import { PageConfig, Sheep, SheepEvent } from '~/frontendlib/dataModel';
import { coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';

import NestedDocument from '~/components/lib/NestedResources/NestedDocument'
import { stringDateFormatter } from '~/utils/dateFormatter';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';
import ScheduledEvents from '~/container/crop/details/ScheduledEvents';
import axios from 'axios';
import { EventPlanModalHandler } from '~/container/crop/plan/EventPlan';
import { log } from 'console';
import CropProgress from '~/container/crop/details/cropProgress';

export { default as getServerSideProps } from '~/utils/ggsp';

const supportingDocumentsEditor = dynamic(
  import('~/gen/data-views/supportingDocuments/supportingDocumentsEditor.rtml'),
);

const Add_sheepEditor = dynamic(import('~/gen/data-views/add_sheep/add_sheepEditor.rtml'));

export interface SheepDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Sheep;
}

export default function SheepDetails(props: any) {
  const { openToast } = useAlert();
  const router = useRouter();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const { changeRoute, getAPIPrefix, getApiUrl } = useOperator();
  const API_URL = `${getAPIPrefix()}/sheep/${router.query.id}`;

  const sheepId = router?.query?.id;

  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    mainBtnTitle: 'Add Event',
    subBtnTitle: 'Schedule Event',
    subBtnColor: 'secondary',
    titleIcon: sheepImg.src,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isTitleIconPresent: true,
  });
  const { isLoading: loading, data, reFetch } = useFetch<Sheep[]>(API_URL);

  const sheepData = data?.[0];

  // Updating plan id on sheep data change
  const [currentPlanId, setCurrentPlanId] = useState<string | undefined>();

  React.useEffect(() => {
    // Find the active plan, if not exists then return the first plan in array
    const getActivePlanId = (sheepData: Sheep | undefined) => {
      let plan = null,
        err = '';

      try {
        if (!sheepData) {
          throw new Error('Sheep Data not available');
        }

        const activePlan = sheepData.plan.find((item) => {
          return item.status.toLowerCase() === 'active';
        });

        plan = activePlan || sheepData.plan[0];

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

    setCurrentPlanId(getActivePlanId(sheepData));
  }, [sheepData]);

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
    if (sheepData) {
      setTitleBarData({
        ...titleBarData,
        title: sheepData?.tagId,
        subTitle: sheepData?.landParcel?.name,
        isMainBtnPresent: sheepData?.status !== 'Completed',
        isSubBtnPresent: sheepData?.status !== 'Completed',
      });
    }
  }, [sheepData]);

  const sheepDetails = {
    id: sheepData?.id,
    name: sheepData?.tagId,
    landParcel: sheepData?.landParcel?.name,
    fieldId: sheepData?.fieldDetails?.[0]?.fbId,
    farmer: {
      id: sheepData?.farmer?.id,
      name: sheepData?.farmer?.name,
    },
    landParcelMap: sheepData?.landParcelDetails?.[0]?.map,
    fieldMap: sheepData?.fieldDetails?.[0]?.map,
    location: sheepData?.fieldDetails?.[0]?.location,
  };

  const overviewData = {
    id: sheepData?.id,
    name: sheepData?.tagId,
    landParcel: sheepData?.landParcel?.name,
    fieldId: sheepData?.fieldDetails?.[0]?.fbId,
    farmer: {
      id: sheepData?.farmer?.id,
      name: sheepData?.farmer?.name,
    },
    age: sheepData?.age,
    breed: sheepData?.breed,
    source: sheepData?.sheepSource,
    pedigree: sheepData?.pedigree,
    gender: sheepData?.gender,
    polygons: [
      {
        paths: coordinateStringToCoordinateObject(sheepDetails?.fieldMap || ''),
        options: { ...mapStyles.fieldMap },
      },
    ],
    landPolygon: {
      paths: coordinateStringToCoordinateObject(sheepDetails?.landParcelMap || ''),
      options: { ...mapStyles.landParcelMap },
    },
  };

  const handleClose = () => {
    setOpenModal(null);
  };

  const supportingDocuments = [
    ...(sheepData?.documents
      ? sheepData?.documents?.map((f: any) => ({
        subText: f?.category,
        url: f?.link,
      })) || []
      : []),
  ];

  const overviewDataList = [
    {
      icon: <CalendarBlank color={theme.palette.iconColor.default} />,
      title: 'Age',
      value: overviewData.age,
    },
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Breed',
      value: overviewData.breed,
    },
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Gender',
      value: overviewData.gender,
    },
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Source',
      value: overviewData.source,
    },
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Pedigree',
      value: overviewData.pedigree,
    },
    {
      icon: <Layout color={theme.palette.iconColor.tertiary} />,
      title: 'Field',
      value: overviewData.fieldId,
    },
    {
      icon: <Person color={theme.palette.iconColor.primary} />,
      title: 'Farmer',
      value: overviewData.farmer?.name,
    },
  ];
  const handleAddFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/sheep/${router.query.id}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Sheep details updated');
          setOpenModal(null);
        });

      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update sheep details');
      console.log(error);
    }
  };
  const handleEditSheepFormSubmit = async (formData: any) => {
    try {
      delete formData._id;
      console.log('Sheep formData', formData);
      const apiUrl = getApiUrl(`/sheep/${router.query.id}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Sheep details updated');
          setOpenModal(null);
        });

      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update sheep details');
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
      count: sheepData?.plan[0]?.events?.length ?? 0,
    },
    {
      label: 'Documents',
      icon: <Files color={theme.palette.iconColor.default} />,
    },
  ];

  const onPlanEventCreateOrUpdateCallback = () => {
    reFetch(API_URL);
  };


  function fetchData() {
    return reFetch(API_URL);
  }


  const componentList = [
    {
      component: OverviewTab,
      props: {
        data: overviewData,
        overviewDataList: overviewDataList,
        showMainButton: true,
        mainButtonTitle: 'Edit Sheep Details',
        handleMainBtnClick: () => setOpenModal('editSheep'),
        kmlString: sheepData?.fieldDetails?.[0]?.map,
        kmlName: sheepData?.tagId,
      },
    },
    {
      label: 'Sheep Progress',
      icon: <ChartLine color={theme.palette.iconColor.primary} />,
      component: EntityProgress,

      props: {
        data: sheepDetails,
        entity: 'sheep',
        category: 'sheep',
        eventData: {
          data: sheepData?.events.filter((event: SheepEvent) => event.category === 'Sheep'),
          eventType: 'Calendar',
        },
        reFetch: () => reFetch(API_URL),
      },
    },
    {
      label: 'Scheduled Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      count: sheepData?.plan[0]?.events?.length ?? 0,
      component: ScheduledEvents,
      props: {
        ...getScheduledEventsData(sheepData, 'sheep', fetchData),
      },
    },

    {
      component: NestedDocument,
      props: {
        data: sheepData,
        reFetch: () => reFetch(API_URL),
        childResourceUri: 'documents',
        modelName: 'sheep'
      },
    },
  ];

  async function productionSystemFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/productionsystem`);

    // Filter the data array based on the productionSystemId
    const filteredData = res.data.filter((productionSystemDetails: any) => productionSystemDetails.landParcel === data?.[0].landParcel?.id && productionSystemDetails.category === 'Sheep');

    return filteredData;
  }

  const formContext: any = {
    foreignObjectLoader: productionSystemFilter,
  };

  const renderModal = () => {
    switch (openModal) {
      case 'editSheep':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <Add_sheepEditor
              formData={{
                data: sheepData,
              }}
              onSubmit={handleEditSheepFormSubmit}
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
          changeRoute(`/crop/${sheepId}/create-event`);
        }}
        handleSubBtnClick={onScheduleEventClick}
      />
      <EventPlanModalHandler
        currentPlanId={currentPlanId}
        category={'sheep'}
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
              series={[sheepData?.climateScore || 0, 100 - (sheepData?.climateScore || 0)]}
            />
            <Box>
              <Typography color='textPrimary' variant='body1' fontWeight={550}>
                {sheepData?.climateScore} %
              </Typography>
              <Typography color='textSecondary' variant='caption' fontWeight={400}>
                Climate Impact Score
              </Typography>
            </Box>
            <Donut
              color={theme.palette.chart.secondary}
              series={[sheepData?.complianceScore || 0, 100 - (sheepData?.complianceScore || 0)]}
            />
            <Box>
              <Typography color='textPrimary' variant='body1' fontWeight={550}>
                {sheepData?.complianceScore || 0} %
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
