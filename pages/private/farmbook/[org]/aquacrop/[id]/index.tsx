import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useAlert } from '~/contexts/AlertContext';

import Dialog from '~/components/lib/Feedback/Dialog';
import CropProgress from '~/container/crop/details/cropProgress';
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
  Rupee,
  Plant,
  Flower,
} from '~/components/Icons';
import Donut from '~/components/common/Chart/Donut';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import aquacropImg from '../../../../../../public/assets/images/crop.svg';
import mapStyles from '~/styles/theme/map/styles';

import { PageConfig, AquaCrop, AquaCropEvent } from '~/frontendlib/dataModel';
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
import { QRCode } from '~/frontendlib/QR/QRCode';

export { default as getServerSideProps } from '~/utils/ggsp';

const supportingDocumentsEditor = dynamic(
  import('~/gen/data-views/supportingDocuments/supportingDocumentsEditor.rtml'),
);

const Add_aquacropEditor = dynamic(import('~/gen/data-views/add_aquacrop/add_aquacropEditor.rtml'));

export interface AquaCropDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: AquaCrop;
}

export default function AquaCropDetails(props: any) {
  const { openToast } = useAlert();
  const router = useRouter();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const { changeRoute, getAPIPrefix, getApiUrl } = useOperator();
  const API_URL = `${getAPIPrefix()}/aquacrop/${router.query.id}`;
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    mainBtnTitle: 'Add Event',
    subBtnTitle: 'Schedule Event',
    subBtnColor: 'secondary',
    titleIcon: aquacropImg.src,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isTitleIconPresent: true,
  });

  const aquacropId = router?.query?.id;

  const { isLoading: loading, data, reFetch } = useFetch<AquaCrop[]>(API_URL);

  const aquacropData = data?.[0];

  // Updating plan id on aquacrop data change
  const [currentPlanId, setCurrentPlanId] = useState<string | undefined>();

  React.useEffect(() => {
    // Find the active plan, if not exists then return the first plan in array
    const getActivePlanId = (aquacropData: AquaCrop | undefined) => {
      let plan = null,
        err = '';

      try {
        if (!aquacropData) {
          throw new Error('AquaCrop Data not available');
        }

        const activePlan = aquacropData.plan.find((item) => {
          return item.status.toLowerCase() === 'active';
        });

        plan = activePlan || aquacropData.plan[0];

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

    setCurrentPlanId(getActivePlanId(aquacropData));
  }, [aquacropData]);

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
    if (aquacropData) {
      setTitleBarData({
        ...titleBarData,
        title: aquacropData?.cropType,
        subTitle: aquacropData?.landParcel?.name,
        isMainBtnPresent: aquacropData?.status !== 'Completed',
        isSubBtnPresent: aquacropData?.status !== 'Completed',
      });
    }
  }, [aquacropData]);

  const aquacropDetails = {
    id: aquacropData?.id,
    name: aquacropData?.cropType,
    landParcel: aquacropData?.landParcel?.name,
    fieldId: aquacropData?.fieldDetails?.[0]?.fbId,
    farmer: {
      id: aquacropData?.farmer?.id,
      name: aquacropData?.farmer?.name,
    },
    landParcelMap: aquacropData?.landParcelDetails?.[0]?.map,
    fieldMap: aquacropData?.fieldDetails?.[0]?.map,
    location: aquacropData?.fieldDetails?.[0]?.location,
    entityProgress: aquacropData?.entityProgress,
  };

  const overviewData = {
    id: aquacropData?.id,
    name: aquacropData?.cropType,
    landParcel: aquacropData?.landParcel?.name,
    fieldId: aquacropData?.fieldDetails?.[0]?.fbId,
    farmer: {
      id: aquacropData?.farmer?.id,
      name: aquacropData?.farmer?.name,
    },
    startDate: aquacropData?.actualStockingDate,
    plannedStartDate: aquacropData?.plannedStockingDate,
    estHarvestDate: aquacropData?.estHarvestDate,
    actualHarvestDate: aquacropData?.actualHarvestDate,
    estimatedYieldTonnes: aquacropData?.estimatedYieldTonnes,
    actualYieldTonnes: aquacropData?.actualYieldTonnes,
    cropSubType: aquacropData?.cropSubType,
    seedVariety: aquacropData?.seedVariety,
    seedSource: aquacropData?.seedSource,
    source: aquacropData?.seedSource,
    size: aquacropData?.quantity,

    costOfCultivation: aquacropData?.costOfCultivation,
    polygons: [
      {
        paths: coordinateStringToCoordinateObject(aquacropDetails?.fieldMap || ''),
        options: { ...mapStyles.fieldMap },
      },
    ],
    landPolygon: {
      paths: coordinateStringToCoordinateObject(aquacropDetails?.landParcelMap || ''),
      options: { ...mapStyles.landParcelMap },
    },
  };

  const handleClose = () => {
    setOpenModal(null);
  };

  const overviewDataList = [
    {
      icon: <Ruler color={theme.palette.iconColor.default} />,
      title: 'Stock Size (Kgs)',
      value: overviewData.size,
    },
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Crop Sub Type',
      value: overviewData.cropSubType,
    },
    {
      icon: <Layout color={theme.palette.iconColor.tertiary} />,
      title: 'Field',
      value: overviewData.fieldId,
    },
    {
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      title: 'Planned Stocking Date',
      value: overviewData.plannedStartDate?.toString() || '',
    },
    {
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      title: 'Actual Stocking Date',
      value: overviewData.startDate?.toString() || '',
    },
    {
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      title: 'Estimated Harvest Date',
      value: overviewData.estHarvestDate?.toString() || '',
    },
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Estimated Total Yield',
      value: overviewData.estimatedYieldTonnes?.toString().concat(' tonnes'),
    },
    {
      icon: <Leaf color={theme.palette.iconColor.primary} />,
      title: 'Actual Total Yield',
      value: overviewData?.actualHarvestDate
        ? overviewData.actualYieldTonnes?.toString().concat(' tonnes')
        : 'NA',
    },
    {
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      title: 'Harvest Date(s)',
      value: overviewData?.actualHarvestDate
        ? overviewData?.actualHarvestDate
          .toString()
          .split(',')
          .map((dateString) => ({
            original: dateString.trim(),
            formatted: new Date(stringDateFormatter(dateString.trim() || '')),
          }))
          .sort((a: any, b: any) => a.formatted - b.formatted)
          .map((dateObj) => {
            const date = new Date(dateObj.formatted);
            const day = date.getDate().toString().padStart(2, '0');
            const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
            const year = date.getFullYear().toString();
            return `${day} ${month} ${year}`;
          })
          .join(', ')
        : 'NA',
    },
    {
      icon: <Plant color={theme.palette.iconColor.primary} />,
      title: 'Seed Variety',
      value: overviewData.seedVariety,
    },
    {
      icon: <Flower color={theme.palette.iconColor.primary} />,
      title: 'Seed Source',
      value: overviewData.seedSource,
    },
    {
      icon: <Person color={theme.palette.iconColor.primary} />,
      title: 'Farmer',
      value: overviewData.farmer?.name,
    },
    {
      icon: <Rupee color={theme.palette.iconColor.primary} />,
      title: 'Cost of Cultivation',
      value: overviewData.costOfCultivation ? 'Rs. ' + overviewData.costOfCultivation : 'NA',
    },
  ];
  const handleAddFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/aquacrop/${router.query.id}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'AquaCrop details updated');
          setOpenModal(null);
        });

      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update aquacrop details');
      console.log(error);
    }
  };
  const handleEditAquaCropFormSubmit = async (formData: any) => {
    try {
      delete formData._id;
      const apiUrl = getApiUrl(`/aquacrop/${router.query.id}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'AquaCrop details updated');
          setOpenModal(null);
        });

      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update aquacrop details');
      console.log(error);
    }
  };

  const labelList = [
    {
      label: 'Overview',
      icon: <Cube color={theme.palette.iconColor.default} />,
    },
    {
      label: 'Aquaculture Crop Progress',
      icon: <ChartLine color={theme.palette.iconColor.primary} />,
    },
    {
      label: 'Scheduled Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
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
        mainButtonTitle: 'Edit Aquaculture Crop Details',
        handleMainBtnClick: () => setOpenModal('editAquaCrop'),
        kmlString: aquacropData?.fieldDetails?.[0]?.map,
        kmlName: aquacropData?.cropType,
        QRCode: () => {
          return aquacropData?.qrLink ? <QRCode link={aquacropData?.qrLink} /> : <></>;
        },
      },
    },
    {
      component: CropProgress,
      props: {
        data: aquacropDetails,
        category: 'aquacrop',
        eventData: {
          data: aquacropData?.events?.filter(
            (event: AquaCropEvent) => event.category === 'Aquaculture Crop',
          ),
          eventType: 'Calendar',
        },
      },
    },
    {
      component: ScheduledEvents,
      props: {
        data: aquacropData,
        category: 'aquacrop',
        eventData: {
          data: aquacropData?.plan[0]?.events,
          eventType: 'Scheduled',
        },
        currentPlanId,
        onPlanEventCreateOrUpdateCallback,
      },
    },
    {
      component: NestedDocument,
      props: {
        data: aquacropData,
        reFetch: () => reFetch(API_URL),
        childResourceUri: 'documents',
        modelName: 'aquacrop'
      },
    },
  ];

  const renderModal = () => {
    switch (openModal) {
      case 'editAquaCrop':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <Add_aquacropEditor
              formData={{
                data: aquacropData,
              }}
              onSubmit={handleEditAquaCropFormSubmit}
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
          changeRoute(`/aquacrop/${aquacropId}/create-event`);
        }}
        handleSubBtnClick={onScheduleEventClick}
      />
      <EventPlanModalHandler
        currentPlanId={currentPlanId}
        category={'aquacrop'}
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
              series={[aquacropData?.climateScore || 0, 100 - (aquacropData?.climateScore || 0)]}
            />
            <Box>
              <Typography color='textPrimary' variant='body1' fontWeight={550}>
                {aquacropData?.climateScore} %
              </Typography>
              <Typography color='textSecondary' variant='caption' fontWeight={400}>
                Climate Impact Score
              </Typography>
            </Box>
            <Donut
              color={theme.palette.chart.secondary}
              series={[
                aquacropData?.complianceScore || 0,
                100 - (aquacropData?.complianceScore || 0),
              ]}
            />
            <Box>
              <Typography color='textPrimary' variant='body1' fontWeight={550}>
                {aquacropData?.complianceScore || 0} %
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
