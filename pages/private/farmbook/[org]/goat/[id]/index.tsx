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

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import goatImg from '../../../../../../public/assets/images/crop.svg';
import mapStyles from '~/styles/theme/map/styles';

import { PageConfig, Goat, GoatEvent } from '~/frontendlib/dataModel';
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
import
getScheduledEventsData
  from "~/entitylib/functions/getData/getScheduledEventsData";
import EntityProgress from '~/components/lib/EntityProgress';




const supportingDocumentsEditor = dynamic(
  import('~/gen/data-views/supportingDocuments/supportingDocumentsEditor.rtml'),
);

const Add_goatEditor = dynamic(import('~/gen/data-views/add_goat/add_goatEditor.rtml'));

export interface GoatDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Goat;
}

export default function GoatDetails(props: any) {
  const { openToast } = useAlert();
  const router = useRouter();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const { changeRoute, getAPIPrefix, getApiUrl } = useOperator();
  const API_URL = `${getAPIPrefix()}/goat/${router.query.id}`;

  const goatId = router?.query?.id;

  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    mainBtnTitle: 'Add Event',
    subBtnTitle: 'Schedule Event',
    subBtnColor: 'secondary',
    titleIcon: goatImg.src,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isTitleIconPresent: true,
  });
  const { isLoading: loading, data, reFetch } = useFetch<Goat[]>(API_URL);

  const goatData = data?.[0];

  // Updating plan id on goat data change
  const [currentPlanId, setCurrentPlanId] = useState<string | undefined>();

  React.useEffect(() => {
    // Find the active plan, if not exists then return the first plan in array
    const getActivePlanId = (goatData: Goat | undefined) => {
      let plan = null,
        err = '';

      try {
        if (!goatData) {
          throw new Error('Goat Data not available');
        }

        const activePlan = goatData.plan.find((item) => {
          return item.status.toLowerCase() === 'active';
        });

        plan = activePlan || goatData.plan[0];

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

    setCurrentPlanId(getActivePlanId(goatData));
  }, [goatData]);

  /** On Schedule event **/

  // State management for Event plan modal
  const [planEventModalToggle, setPlanEventModalToggle] = useState(false);

  // Closes Event plan model
  const hideEventPlanModal = () => {
    setPlanEventModalToggle(false);
  };

  function fetchData() {
    return reFetch(API_URL);
  }
  /**
   *  It Opens a popup for user to create a new event plan
   * */
  const onScheduleEventClick = () => {
    setPlanEventModalToggle((prevState) => !prevState);
  };

  React.useEffect(() => {
    if (goatData) {
      setTitleBarData({
        ...titleBarData,
        title: goatData?.tagId,
        subTitle: goatData?.landParcel?.name,
        isMainBtnPresent: goatData?.status !== 'Completed',
        isSubBtnPresent: goatData?.status !== 'Completed',
      });
    }
  }, [goatData]);

  const goatDetails = {
    id: goatData?.id,
    name: goatData?.tagId,
    landParcel: goatData?.landParcel?.name,
    fieldId: goatData?.fieldDetails?.[0]?.fbId,
    farmer: {
      id: goatData?.farmer?.id,
      name: goatData?.farmer?.name,
    },
    landParcelMap: goatData?.landParcelDetails?.[0]?.map,
    fieldMap: goatData?.fieldDetails?.[0]?.map,
    location: goatData?.fieldDetails?.[0]?.location,
  };

  const overviewData = {
    id: goatData?.id,
    name: goatData?.tagId,
    landParcel: goatData?.landParcel?.name,
    fieldId: goatData?.fieldDetails?.[0]?.fbId,
    farmer: {
      id: goatData?.farmer?.id,
      name: goatData?.farmer?.name,
    },
    age: goatData?.age,
    breed: goatData?.breed,
    source: goatData?.goatSource,
    pedigree: goatData?.pedigree,
    gender: goatData?.gender,
    polygons: [
      {
        paths: coordinateStringToCoordinateObject(goatDetails?.fieldMap || ''),
        options: { ...mapStyles.fieldMap },
      },
    ],
    landPolygon: {
      paths: coordinateStringToCoordinateObject(goatDetails?.landParcelMap || ''),
      options: { ...mapStyles.landParcelMap },
    },
  };

  const handleClose = () => {
    setOpenModal(null);
  };

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
      const apiUrl = getApiUrl(`/goat/${router.query.id}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Goat details updated');
          setOpenModal(null);
        });

      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update goat details');
      console.log(error);
    }
  };
  const handleEditGoatFormSubmit = async (formData: any) => {
    try {
      delete formData._id;
      const apiUrl = getApiUrl(`/goat/${router.query.id}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Goat details updated');
          setOpenModal(null);
        });

      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update goat details');
      console.log(error);
    }
  };

  const labelList = [
    {
      label: 'Overview',
      icon: <Cube color={theme.palette.iconColor.default} />,
    },
    { label: 'Events', icon: <ChartLine color={theme.palette.iconColor.primary} /> },
    {
      label: 'Scheduled Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      count: goatData?.plan[0]?.events?.length ?? 0,
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
        mainButtonTitle: 'Edit Goat Details',
        handleMainBtnClick: () => setOpenModal('editGoat'),
        kmlString: goatData?.fieldDetails?.[0]?.map,
        kmlName: goatData?.tagId,
      },
    },
    {
      label: 'Goat Progress',
      icon: <ChartLine color={theme.palette.iconColor.primary} />,
      component: EntityProgress,

      props: {
        data: goatDetails,
        entity: 'goat',
        category: 'goat',
        eventData: {
          data: goatData?.events.filter((event: GoatEvent) => event.category === 'Goat'),
          eventType: 'Calendar',
        },
        reFetch: () => reFetch(API_URL),
      },
    },
    {
      label: 'Scheduled Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      count: goatData?.plan[0]?.events?.length ?? 0,
      component: ScheduledEvents,
      props: {
        ...getScheduledEventsData(goatData, 'goat', fetchData),
      },
    },

    {
      component: NestedDocument,
      props: {
        data: goatData,
        reFetch: () => reFetch(API_URL),
        childResourceUri: 'documents',
        modelName: 'goat'
      },
    },
  ];

  async function productionSystemFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/productionsystem`);

    // Filter the data array based on the productionSystemId
    const filteredData = res.data.filter((productionSystemDetails: any) => productionSystemDetails.landParcel === data?.[0].landParcel?.id && productionSystemDetails.category === 'Goats');

    return filteredData;
  }

  const formContext: any = {
    foreignObjectLoader: productionSystemFilter,
  };


  const renderModal = () => {
    switch (openModal) {
      case 'editGoat':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <Add_goatEditor
              formData={{
                data: goatData,
              }}
              onSubmit={handleEditGoatFormSubmit}
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
          changeRoute(`/crop/${goatId}/create-event`);
        }}
        handleSubBtnClick={onScheduleEventClick}
      />
      <EventPlanModalHandler
        currentPlanId={currentPlanId}
        category={'goat'}
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
              series={[goatData?.climateScore || 0, 100 - (goatData?.climateScore || 0)]}
            />
            <Box>
              <Typography color='textPrimary' variant='body1' fontWeight={550}>
                {goatData?.climateScore} %
              </Typography>
              <Typography color='textSecondary' variant='caption' fontWeight={400}>
                Climate Impact Score
              </Typography>
            </Box>
            <Donut
              color={theme.palette.chart.secondary}
              series={[goatData?.complianceScore || 0, 100 - (goatData?.complianceScore || 0)]}
            />
            <Box>
              <Typography color='textPrimary' variant='body1' fontWeight={550}>
                {goatData?.complianceScore || 0} %
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
