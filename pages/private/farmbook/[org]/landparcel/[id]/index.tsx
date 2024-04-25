// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import axios from 'axios';

import { Box, Grid, IconButton, SxProps, Typography, useTheme } from '@mui/material';

import OverviewTab from '~/container/landparcel/details/OverviewTab';
import ProcessingAndStore from '~/container/landparcel/details/ProcessingAndStore';
import CoreAgricultureComponent from '~/container/landparcel/details/CoreAgriculture';
import Configuration from '~/container/landparcel/details/Configuration';
import SupportUtilitiesComponent from '~/container/landparcel/details/SupportUtilities';
import BasicUtilitiesComponent from '~/container/landparcel/details/BasicUtilities';
import ImpactComponent from '~/container/landparcel/details/Impact';
import AlliedActivitiesComponent from '~/container/landparcel/details/AlliedActivities';
import If from '~/components/lib/If';
import EditIcon from '@mui/icons-material/Edit';
import FarmerSubmission from '~/container/crop/details/FarmerSubmission';
import { useAlert } from '~/contexts/AlertContext';

import getScheduledEventsData from "~/entitylib/functions/getData/getScheduledEventsData";

const FarmerEditor = dynamic(
  import('~/gen/data-views/landparcel_addfarmer/landparcel_addfarmerEditor.rtml'),
);

const ProcessorEditor = dynamic(
  import('~/gen/data-views/landparcel_addprocessor/landparcel_addprocessorEditor.rtml'),
);

import Tabs from '~/components/lib/Navigation/Tabs';
import {
  Cube,
  FishSimple,
  Database_orange,
  Database_Violet,
  Factory,
  Leaf_green,
  CalendarBlank,
  Leaf,
  Ruler,
  ToteSimple,
  Person,
  Layout,
  DownloadSimple,
  Files,
  World,
  Map,
  Engine,
} from '~/components/Icons';
import NestedDocument from '~/components/lib/NestedResources/NestedDocument'
import Schemes from '~/components/common/Schemes';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import SoilInfo from '~/components/common/SoilInfo';
import FarmMachineries from '~/container/landparcel/details/FarmMachineries/FarmMachineries';
import Donut from '~/components/common/Chart/Donut';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import {
  coordinateStringToCoordinateObject,
  polygonToMapCenter,
} from '~/utils/coordinatesFormatter';

import mapStyles from '~/styles/theme/map/styles';
import landParcelIcon from '/public/assets/images/landParcelIcon.svg';

import {
  LandParcel,
  LandParcelCoreAgriculture,
  LandParcelAlliedActivity,
  LPEvent,
  PageConfig,
} from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';
import Dialog from '~/components/lib/Feedback/Dialog';
import dynamic from 'next/dynamic';
import Events from '~/container/landparcel/details/Events';
import { calculatePolygonArea } from '~/utils/mapUtils';
import { Analytics, Landscape } from '@mui/icons-material';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import Drawer from '@mui/material/Drawer';
import styles from '~/styles/theme/brands/styles';
import ScheduledEvents from '~/components/lib/ScheduledEvents';
import ValidationWorkflowView from '~/components/workflow/ValidationWorkflowView';

export { default as getServerSideProps } from '~/utils/ggsp';

const MARKER_COLORS: string[] = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#4cc9f0'];

interface LandParcelDetailsParcel {
  sx: SxProps;
  pageConfig: PageConfig;
  data: LandParcel;
}
interface Coordinate {
  lat: number;
  lng: number;
  alt?: number;
}

export default function LandParcelDetails(props: LandParcelDetailsParcel) {
  const theme = useTheme();
  const [openAddFarmerModal, setOpenAddFarmerModal] = useState<boolean>(false);
  const [openAddProcessorModal, setOpenAddProcessorModal] = useState<boolean>(false);
  const [openVerifyLPModal, setOpenVerifyLPModal] = useState<boolean>(false);
  const parentRef = useRef(null);
  const router = useRouter();
  const { operator, changeRoute, getAPIPrefix, getApiUrl } = useOperator();
  const lpId = router?.query?.id as string;
  const API_URL = `${getAPIPrefix()}/landparcel/${lpId}`;
  const modelName = `landparcel`
  const { isLoading: loading, data, reFetch } = useFetch<LandParcel[]>(API_URL);

  const { openToast } = useAlert();
  const handleClose = () => {
    setOpenAddFarmerModal(false);
    setOpenAddProcessorModal(false);
    setOpenVerifyLPModal(false);
  };

  const reFetchCallback = () => reFetch(API_URL);

  const statusStep: {
    [key: string]: {
      buttonLabel: string;
      step: string;
    };
  } = {
    Draft: {
      buttonLabel: 'Submit for Review',
      step: 'basicinfo',
    },
    'Under Review': {
      buttonLabel: 'Review & Approve',
      step: 'verification',
    },
    'Under Survey': {
      buttonLabel: 'Update Survey',
      step: 'govtsurvey',
    },
    'Under Validation': {
      buttonLabel: 'Validate',
      step: 'validation',
    },
    'Review Failed': {
      buttonLabel: 'Submit for Review',
      step: 'basicinfo',
    },
    'Validation Failed': {
      buttonLabel: 'Submit for Review',
      step: 'basicinfo',
    },
    Approved: {
      buttonLabel: 'Approved',
      step: 'basicinfo',
    },
  };
  const lpData = data?.[0];

  console.log("lpdata landowners", lpData);

  // const handleSelectTab = (event: any, selectedTab: number) => setSelectedIndex(selectedTab);

  const getMarkers = () => {
    let markers: any[] = [];
    markers = [
      ...markers,
      ...(lpData?.powerSources?.map?.(
        (
          {
            location = 'NA',
            name = 'NA',
            source = 'NA',
            capacity = 'NA',
            gridPowerCapacity = 'NA',
            solarPowerCapacity = 'NA',
            bioGasProdCapacity = 'NA',
            windEnergyProdCapacity = 'NA',
            generatorProdCapacity = 'NA',
            otherStorageCapacity = 'NA',
          }: any,
          index: number,
        ) => ({
          position: location,
          title: 'Power source: ' + name,
          subTexts: [
            `Source: ${source}`,
            `Capacity: ${source === 'Grid connection'
              ? gridPowerCapacity
              : source === 'Solar power'
                ? solarPowerCapacity
                : source === 'Biogas bio'
                  ? bioGasProdCapacity
                  : source === 'Wind energy'
                    ? windEnergyProdCapacity
                    : source === 'Generator'
                      ? generatorProdCapacity
                      : source === 'Other sources'
                        ? otherStorageCapacity
                        : capacity
            }`,
          ],
          tags: ['Basic Utilities'],
          id: 'marker-' + (markers?.length + index),
          color: MARKER_COLORS[4],
        }),
      ) || []),
    ];
    markers = [
      ...markers,
      ...(lpData?.waterSources?.map?.(
        ({ location = 'NA', source = 'NA', details }: any, index: number) => ({
          position: location,
          title: 'Water source: ' + details?.name,
          subTexts: [
            `Source: ${source || 'NA'}`,
            `${source === 'Borewell'
              ? 'Depth: ' + details?.depth + ' Diameter: ' + details?.diameter
              : source === 'Open well'
                ? 'Depth: ' + details?.depth + ' Diameter: ' + details?.diameter
                : source === 'Canal'
                  ? 'Quantity: ' + details?.quantity + ' Availability: ' + details?.availability
                  : source === 'Other water source'
                    ? 'Capacity: ' + details?.capacity + ' Availability: ' + details?.availability
                    : 'NA'
            }`,
          ],
          tags: ['Basic Utilities'],
          id: 'marker-' + (markers?.length + index),
          color: MARKER_COLORS[5],
        }),
      ) || []),
    ];
    markers = [
      ...markers,
      ...(lpData?.supportUtilities?.map?.(
        (
          { location = 'NA', name = 'NA', size = 'NA', capacity = 'NA', category = 'NA' }: any,
          index: number,
        ) => ({
          position: location,
          title: name,
          subTexts: [`Size: ${size}`, `Capacity: ${capacity}`],
          tags: [category],
          id: 'marker-' + (markers?.length + index),
          color: MARKER_COLORS[3],
        }),
      ) || []),
    ];
    markers = [
      ...markers,
      ...(lpData?.processingUnits?.map?.(
        (
          { location = 'NA', name = 'NA', size = 'NA', capacity = 'NA', category = 'NA' }: any,
          index: number,
        ) => ({
          position: location,
          title: name,
          subTexts: [`Size: ${size}`, `Capacity: ${capacity}`],
          tags: [category],
          id: 'marker-' + (markers?.length + index),
          color: MARKER_COLORS[3],
        }),
      ) || []),
    ];
    markers = [
      ...markers,
      ...(lpData?.alliedActivity?.map?.(
        (
          { location = 'NA', name = 'NA', size = 'NA', capacity = 'NA', category = 'NA' }: any,
          index: number,
        ) => ({
          position: location,
          title: name,
          subTexts: [`Size: ${size}`, `Capacity: ${capacity}`],
          tags: [category],
          id: 'marker-' + (markers?.length + index),
          color: MARKER_COLORS[2],
        }),
      ) || []),
    ];
    return markers;
  };

  interface Landowner {
    personalDetails: any
  }

  const overviewData = {
    id: lpData?._id,
    status: lpData?.status,
    areaInAcres: lpData?.areaInAcres,
    surveyNumber: lpData?.surveyNumber,
    complianceScore: lpData?.complianceScore,
    climateScore: lpData?.climateScore,
    crops: lpData?.crops.filter((c) => c.status !== 'Completed').reduce(function (prevVal, currVal, idx, array) {
      const count = array.filter((crop) => crop.name === currVal.name).length;

      // Check if the crop is not already in the string
      if (prevVal.indexOf(currVal.name) === -1) {
        return idx === 0
          ? `${currVal.name}${count > 1 ? ` (${count})` : ''}`
          : `${prevVal}, ${currVal.name}${count > 1 ? ` (${count})` : ''}`;
      } else {
        return prevVal;
      }
    }, 'NA'),
    farmer:
      lpData?.farmer && lpData?.farmer?.personalDetails?.firstName
        ? lpData?.farmer?.personalDetails?.firstName +
        ' ' +
        (lpData?.farmer?.personalDetails?.lastName || '')
        : 'NA',
    ownership:
      lpData?.farmer?.personalDetails?.firstName ? lpData?.ownership : 'NA',
    leaseDocuments: lpData?.farmer ? lpData.leaseDocuments : null,
    processor:
      lpData?.processor && lpData?.processor?.personalDetails?.firstName
        ? lpData?.processor?.personalDetails?.firstName +
        ' ' +
        (lpData?.processor?.personalDetails?.lastName || '')
        : 'NA',
    landOwner: lpData?.landownerRef === 'Yes'
      ? (lpData?.landowners || []).map((owner: Landowner) => `${owner?.personalDetails?.firstName} ${owner?.personalDetails?.lastName}`).join(', ')
      : `${lpData?.landOwner?.firstName} ${lpData?.landOwner?.lastName || ''}`,


    markers: getMarkers(),
    polygons: [] as {
      paths: Coordinate[][];
      options: {
        strokeColor: string;
        fillColor: string;
        fillOpacity: number;
        strokeOpacity: number;
        strokeWeight: number;
        zIndex: number;
      };
      data: any;
      id: any;
    }[],

    ...(lpData?.map && {
      landPolygon: {
        paths: coordinateStringToCoordinateObject(lpData?.map || ''),
        options: { ...mapStyles.landParcelMap },
      },
    }),
    center: lpData?.location,
    fields: lpData?.fields,
    events: lpData?.events,
  };

  if (lpData?.fields && lpData.fields.length > 0) {
    overviewData.polygons.push(
      ..._.flatMap(
        [lpData?.fields].map((item = []) =>
          item.map(
            (item: any) =>
              item.map && {
                paths: coordinateStringToCoordinateObject(item.map || ''),
                options: { ...mapStyles.fieldMap },
                data: item,
                id: item?.id,
              },
          ),
        ),
      ),
    );
  }

  if (lpData?.plots && lpData.plots.length > 0) {
    overviewData.polygons.push(
      ..._.flatMap(
        [lpData?.plots].map((item = []) =>
          item.map(
            (item: any) =>
              item.map && {
                paths: coordinateStringToCoordinateObject(item.map || ''),
                options: { ...mapStyles.plotMap },
                data: item,
                id: item?.id,
              },
          ),
        ),
      ),
    );
  }

  if (lpData?.farmhouses && lpData.farmhouses.length > 0) {
    overviewData.polygons.push(
      ..._.flatMap(
        [lpData?.farmhouses].map((item = []) =>
          item.map(
            (item: any) =>
              item.map && {
                paths: coordinateStringToCoordinateObject(item.map || ''),
                options: { ...mapStyles.supportUnitMap },
                data: item,
                id: item?.id,
              },
          ),
        ),
      ),
    );
  }

  if (lpData?.toilets && lpData.toilets.length > 0) {
    overviewData.polygons.push(
      ..._.flatMap(
        [lpData?.toilets].map((item = []) =>
          item.map(
            (item: any) =>
              item.map && {
                paths: coordinateStringToCoordinateObject(item.map || ''),
                options: { ...mapStyles.supportUnitMap },
                data: item,
                id: item?.id,
              },
          ),
        ),
      ),
    );
  }

  if (lpData?.securityHouses && lpData.securityHouses.length > 0) {
    overviewData.polygons.push(
      ..._.flatMap(
        [lpData?.securityHouses].map((item = []) =>
          item.map(
            (item: any) =>
              item.map && {
                paths: coordinateStringToCoordinateObject(item.map || ''),
                options: { ...mapStyles.supportUnitMap },
                data: item,
                id: item?.id,
              },
          ),
        ),
      ),
    );
  }

  if (lpData?.scrapSheds && lpData.scrapSheds.length > 0) {
    overviewData.polygons.push(
      ..._.flatMap(
        [lpData?.scrapSheds].map((item = []) =>
          item.map(
            (item: any) =>
              item.map && {
                paths: coordinateStringToCoordinateObject(item.map || ''),
                options: { ...mapStyles.supportUnitMap },
                data: item,
                id: item?.id,
              },
          ),
        ),
      ),
    );
  }

  if (lpData?.medicalAssistances && lpData.medicalAssistances.length > 0) {
    overviewData.polygons.push(
      ..._.flatMap(
        [lpData?.medicalAssistances].map((item = []) =>
          item.map(
            (item: any) =>
              item.map && {
                paths: coordinateStringToCoordinateObject(item.map || ''),
                options: { ...mapStyles.supportUnitMap },
                data: item,
                id: item?.id,
              },
          ),
        ),
      ),
    );
  }

  if (lpData?.dinings && lpData.dinings.length > 0) {
    overviewData.polygons.push(
      ..._.flatMap(
        [lpData?.dinings].map((item = []) =>
          item.map(
            (item: any) =>
              item.map && {
                paths: coordinateStringToCoordinateObject(item.map || ''),
                options: { ...mapStyles.supportUnitMap },
                data: item,
                id: item?.id,
              },
          ),
        ),
      ),
    );
  }

  if (lpData?.attractions && lpData.attractions.length > 0) {
    overviewData.polygons.push(
      ..._.flatMap(
        [lpData?.attractions].map((item = []) =>
          item.map(
            (item: any) =>
              item.map && {
                paths: coordinateStringToCoordinateObject(item.map || ''),
                options: { ...mapStyles.supportUnitMap },
                data: item,
                id: item?.id,
              },
          ),
        ),
      ),
    );
  }

  if (lpData?.laborQuarters && lpData.laborQuarters.length > 0) {
    overviewData.polygons.push(
      ..._.flatMap(
        [lpData?.laborQuarters].map((item = []) =>
          item.map(
            (item: any) =>
              item.map && {
                paths: coordinateStringToCoordinateObject(item.map || ''),
                options: { ...mapStyles.supportUnitMap },
                data: item,
                id: item?.id,
              },
          ),
        ),
      ),
    );
  }

  const coreAgricultureData: LandParcelCoreAgriculture = useMemo(
    () => ({
      fields: lpData?.fields || [],
      crops: lpData?.crops || [],
      croppingSystems:
        lpData?.croppingSystems.map((item: any) => ({
          id: item._id,
          field: lpData?.fields.filter((f: any) => f.id === item.field)?.[0]?.id,
          fieldId: lpData?.fields.filter((f: any) => f.id === item.field)?.[0]?.fbId,
          mainCrop: lpData?.crops.filter(
            (c: any) => c.category === 'Main' && c.croppingSystem === item.id,
          )?.[0]?.name,
          name: item.name,
          interCrops: lpData?.crops
            .filter((c: any) => (c.category === 'Inter' || c.category === 'Inter 2') && c.croppingSystem === item.id)
            .reduce((acc: any, interCrop: any, index: number) => {
              acc[`interCrop${index + 1}`] = interCrop.name;
              return acc;
            }, {}),
          borderCrops: lpData?.crops
            .filter((c: any) => (c.category === 'Border') && c.croppingSystem === item.id)
            .reduce((acc: any, borderCrop: any, index: number) => {
              acc[`borderCrop${index + 1}`] = borderCrop.name;
              return acc;
            }, {}),
          mixedCrops: lpData?.crops
            .filter((c: any) => (c.category === 'Mixed') && c.croppingSystem === item.id)
            .reduce((acc: any, mixedCrop: any, index: number) => {
              acc[`mixedCrop${index + 1}`] = mixedCrop.name;
              return acc;
            }, {}),
          coverCrops: lpData?.crops
            .filter((c: any) => (c.category === 'Cover') && c.croppingSystem === item.id)
            .reduce((acc: any, coverCrop: any, index: number) => {
              acc[`coverCrop${index + 1}`] = coverCrop.name;
              return acc;
            }, {}),

          status: item.status,
          category: item.category,
          landParcel: item.landParcel,
        })) || [],
      plots:
        lpData?.plots.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          field: item.field,
          fieldName: lpData?.fields.filter((f: any) => f.id === item.field)?.[0]?.fbId,
          crop: lpData?.crops.filter((c: any) => c.plot === item.id)?.[0]?.name,
          area: item.area,
          map: item.map,
          status: item.status,
        })) || [],
    }),
    [lpData],
  );

  const alliedActivityData: LandParcelAlliedActivity = useMemo(
    () => ({
      fields: lpData?.fields || [],
      poultryBatches: lpData?.poultrybatches || [],
      aquacrops: lpData?.aquacrops || [],
      cows: lpData?.cows || [],
      goats: lpData?.goats || [],
      sheeps: lpData?.sheeps || [],
      productionSystems:
        lpData?.productionSystems.map((item: any) => {
          const category = item.category;
          const poultryBatch = lpData?.poultrybatches?.find(
            (p: any) => p.productionSystem === item._id,
          );
          const poultryBatchName = poultryBatch ? poultryBatch.batchIdName : null;

          const aquacropName = lpData?.aquacrops?.[0]?.cropType;
          const cowName = lpData?.cows?.[0]?.tagId;
          const goatNameName = lpData?.goats?.[0]?.tagId;
          const sheepName = lpData?.sheeps?.[0]?.tagId;
          const categoryWithBatchName = poultryBatchName
            ? `${category} (${poultryBatchName})`
            : category;
          return {
            id: item._id,
            field: item.field,
            fieldName: lpData?.fields.filter((f: any) => f.id === item.field)?.[0]?.fbId,
            status: item.status,
            category: categoryWithBatchName,
            name: item.name,
            landParcel: item.landParcel,
          };
        }) || [],
    }),
    [lpData],
  );

  const handleAddFarmerSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/landparcel-farmer`);
      await axios.post(apiUrl, {
        ...formData,
        landParcel: lpData?._id,
      });
      setOpenAddFarmerModal(false);
      reFetch(API_URL);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleAddProcessorSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/landparcel-processor`);
      await axios.post(apiUrl, {
        ...formData,
        landParcel: lpData?._id,
      });
      setOpenAddProcessorModal(false);
      reFetch(API_URL);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleLandParcelUpdateFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/landparcel/${router.query.id}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Land parcel details updated');
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update land parcel details');
      console.log(error);
    }
  };

  const handleAddFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/landparcel/${router.query.id}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Land parcel updated!');
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update the land parcel');
      console.log(error);
    }
  };

  const handleAddFieldSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/field`);
      if (!formData.landParcelMap) {
        let paths = coordinateStringToCoordinateObject(formData?.map);
        let acres = calculatePolygonArea({ paths: paths });
        let coordinates = polygonToMapCenter(paths[0]);
        formData.calculatedAreaInAcres = acres?.toFixed(2);
        formData.location = coordinates;
      }
      await axios
        .post(apiUrl, {
          ...formData,
          landParcel: router.query.id,
        })
        .then((res) => {
          openToast('success', 'Field parcel added!');
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to ad field parcel.');
      console.log(error);
    }
  };

  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    titleIcon: landParcelIcon.src,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isTitleBtnPresent: true,
    isMainBtnPresent: true,
    isTitleIconPresent: true,
    isSubBtnPresent: true,
  });

  // setting titleBar for farmerDetails page
  React.useEffect(() => {
    if (lpData) {
      setTitleBarData({
        ...titleBarData,
        title: lpData?.name,
        subTitle: Object.values(lpData?.address || {}).join(', '),
        mainBtnTitle:
          !(lpData?.farmer && lpData?.farmer?.personalDetails?.firstName) &&
            lpData?.status == 'Draft'
            ? 'Edit'
            : statusStep?.[lpData?.status]?.buttonLabel,
        titleButtonColor:
          lpData?.status == 'Approved'
            ? 'success'
            : lpData?.status == 'Declined'
              ? 'error'
              : 'warning',
        titleBtnText: lpData?.status || 'Draft',
        subBtnTitle: !(lpData?.farmer && lpData?.farmer?.personalDetails?.firstName)
          ? 'Link Farmer'
          : lpData?.status == 'Draft' ||
            lpData?.status == 'Review Failed' ||
            lpData?.status == 'Validation Failed'
            ? 'Edit'
            : 'Add Event',
        isSubBtnPresent: true,
      });
    }
  }, [lpData]);

  const labelList = [
    {
      label: 'Overview',
      icon: <Cube color={theme.palette.iconColor.default} />,
    },
    {
      label: 'Configuration',
      icon: <Layout color={theme.palette.iconColor.tertiary} />,
    },
    ...(process.env.NEXT_PUBLIC_APP_NAME !== 'poultrybook' ? [
    {
      label: 'Core Agriculture',
      icon: <Leaf_green color={theme.palette.iconColor.primary} />,
    },
  ]: []),
    {
      label: 'Allied Activities',
      icon: <FishSimple color={theme.palette.iconColor.secondary} />,
    },
    {
      label: 'Processing & Store',
      icon: <Factory color={theme.palette.iconColor.tertiary} />,
    },
    {
      label: 'Support Utilities',
      icon: <Database_orange color={theme.palette.iconColor.default} />,
    },
    {
      label: 'Basic Utilities',
      icon: <Database_Violet color={theme.palette.iconColor.tertiary} />,
    },
    {
      label: 'Documents',
      icon: <Files color={theme.palette.iconColor.default} />,
    },
    {
      label: 'Schemes',
      icon: <WorkspacePremiumOutlinedIcon color='error' />,
    },
    {
      label: 'Soil Map',
      icon: <Map color={theme.palette.iconColor.default} />,
    },
    {
      label: 'Farm Machineries',
      icon: <Engine color={theme.palette.iconColor.default} />,
    },
    {
      label: 'Farmer Submissions',
      icon: <DownloadSimple color={theme.palette.iconColor.tertiary} />,
      count:
        lpData?.events.filter((event: LPEvent) => event.category === 'Submission')?.length ?? 0,
    },
    {
      label: 'Scheduled Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      count: lpData?.plan[0]?.events?.length ?? 0,
    },
    {
      label: 'Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
    },
    {
      label: 'Impact',
      icon: <World color={theme.palette.iconColor.primary} />,
    },
    {
      label: 'History',
      icon: <Files color={theme.palette.iconColor.secondary} />,
    },
  ];

  const overviewDataList = [
    {
      icon: <Ruler color={theme.palette.iconColor.default} />,
      title: 'Area',
      value: overviewData.areaInAcres?.toString().concat(' acre(s)'),
    },
    {
      icon: <CalendarBlank color={theme.palette.iconColor.tertiary} />,
      title: 'Survey Number',
      value: overviewData?.surveyNumber,
    },
    ...(process.env.NEXT_PUBLIC_APP_NAME === 'praanaos'
      ? [
        {
          icon: <Leaf color={theme.palette.iconColor.primary} />,
          title: 'Current Crops',
          value: overviewData.crops,
        },
      ]
      : []),
    {
      icon: <Person color={theme.palette.iconColor.secondary} />,
      title: 'Farmer',
      value: (
        <Grid container alignItems='center'>
          <IconButton id='editFarmerButton' onClick={() => setOpenAddFarmerModal(true)}>
            <EditIcon fontSize='small' />
          </IconButton>
          {overviewData.farmer}
        </Grid>
      ),
    },
    {
      icon: <CalendarBlank color={theme.palette.iconColor.quaternary} />,
      title: 'Ownership Status',
      value: overviewData.ownership,
    },
    ...(overviewData.ownership === 'Leased' && lpData?.leaseDocuments?.length
      ? lpData.leaseDocuments.map((document: any, index: any) => ({
        icon: <Files color={theme.palette.iconColor.primary} />,
        title: `Lease Document ${index + 1}`,
        url: document,
      }))
      : []),
    {
      icon: <ToteSimple color={theme.palette.iconColor.quaternary} />,
      title: 'Land Owner',
      value: overviewData.landOwner,
    },

    {
      icon: <Person color={theme.palette.iconColor.secondary} />,
      title: 'Processor',
      value: (
        <Grid container alignItems='center'>
          <IconButton id='editProcessorButton' onClick={() => setOpenAddProcessorModal(true)}>
            <EditIcon fontSize='small' />
          </IconButton>
          {overviewData.processor}
        </Grid>
      ),
    },
    {
      icon: <Landscape sx={{ color: theme.palette.iconColor.quaternary }} />,
      title: 'Calculated Area',
      value: `${_.round(calculatePolygonArea(overviewData.landPolygon) || 0, 2)} Acres`,
    },
    ...(lpData?.landOwnershipDocument
      ? [
        {
          icon: <Files color={theme.palette.iconColor.primary} />,
          title: 'Land Ownership Document',
          url: lpData?.landOwnershipDocument,
        },
      ]
      : []),
    ...(lpData?.landGovtMap
      ? [
        {
          icon: <Files color={theme.palette.iconColor.primary} />,
          title: 'Land Govt Map',
          url: lpData?.landGovtMap,
        },
      ]
      : []),
    ...(lpData?.landSupportDocument
      ? [
        {
          icon: <Files color={theme.palette.iconColor.primary} />,
          title: 'Land EC',
          url: lpData?.landSupportDocument,
        },
      ]
      : []),
  ];

  const componentList = [
    {
      component: OverviewTab,
      props: {
        data: overviewData,
        overviewDataList: overviewDataList,
        kmlString: lpData?.map,
        kmlName: lpData?.name,
        reFetch: () => reFetch(API_URL),
        showWeatherReport: true
      },
    },
    {
      component: Configuration,
      props: {
        coreAgricultureData,
        lpData,
        handleFormSubmit: handleAddFieldSubmit,
        reFetch: () => reFetch(API_URL),
      },
    },
    ...(process.env.NEXT_PUBLIC_APP_NAME === 'farmbook' ? [
    {
      component: CoreAgricultureComponent,
      props: {
        coreAgricultureData,
        lpData,
        reFetch: () => reFetch(API_URL),
        handleFormSubmit: handleAddFieldSubmit,
      },
    },
    ]
      : []),
    {
      component: AlliedActivitiesComponent,
      props: {
        alliedActivityData,
        lpData,
        handleFormSubmit: handleAddFormSubmit,
        reFetch: () => reFetch(API_URL),
      },
    },
    {
      component: ProcessingAndStore,
      props: { lpData, handleFormSubmit: handleAddFormSubmit, reFetch: reFetchCallback, modelName },
    },
    {
      component: SupportUtilitiesComponent,
      props: { lpData, handleFormSubmit: handleAddFormSubmit, reFetch: reFetchCallback, modelName },
    },
    {
      component: BasicUtilitiesComponent,
      props: { lpData, handleFormSubmit: handleAddFormSubmit, reFetch: reFetchCallback, modelName },
    },
    {
      component: NestedDocument,
      props: {
        data: lpData,
        reFetch: () => reFetch(API_URL),
        childResourceUri: 'documents',
        modelName
      },
    },
    {
      component: Schemes,
      props: {
        data: {
          schemes: lpData?.schemes,
        },
        handleFormSubmit: handleLandParcelUpdateFormSubmit,
      },
    },
    {
      component: SoilInfo,
      props: {
        data: {
          soilInfo: lpData?.soilInfo,
          map: lpData?.map,
          events: lpData?.events,
        },
        handleFormSubmit: handleLandParcelUpdateFormSubmit,
      },
    },
    {
      component: FarmMachineries,
      props: {
        lpData,
        modelName,
        handleFormSubmit: handleAddFormSubmit,
        reFetch: reFetchCallback
      },
    },
    {
      component: FarmerSubmission,
      props: {
        eventData: {
          data: lpData?.events.filter((event: LPEvent) => event.category === 'Submission'),
          eventType: 'Submission',
        },
        landParcelMap: lpData?.map,
      },
    },
    {
      label: 'Scheduled Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      count: lpData?.plan[0]?.events?.length ?? 0,
      component: ScheduledEvents,
      props: {
        ...getScheduledEventsData(lpData, 'landparcel', reFetchCallback),
      },
    },
    {
      component: Events,
      props: {
        data: lpData,
        eventData: {
          data: lpData?.events.filter((event: LPEvent) => event.category === 'Land Parcel'),
          eventType: 'Calendar',
        },
      },
    },

    {
      component: ImpactComponent,
      props: { lpData, handleFormSubmit: handleAddFormSubmit, reFetch: reFetchCallback },
    },
    {
      component: EntityHistoryCard,
      props: {
        data: {
          history: lpData?.history,
          collective: operator,
        },
      },
    },
  ];

  async function farmerProcessorFilter(options: any) {
    if (options?.uiOptions.filterKey === 'processor') {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/processor`);

      // Filter the data array based on the productionSystemId
      const filteredData = res.data.filter(
        (processor: any) => processor.active === true,
      );

      return filteredData;

    } else {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/farmer`);

      // Filter the data array based on the productionSystemId
      const filteredData = res.data.filter(
        (farmer: any) => farmer.active === true,
      );

      return filteredData;

    }
  }

  const formContext: any = {
    getApiUrl,
    foreignObjectLoader: farmerProcessorFilter,
  };

  return (
    <CircularLoader value={loading}>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleMainBtnClick={() => {
          !(lpData?.farmer && lpData?.farmer?.personalDetails?.firstName) && lpData?.status == 'Draft'
            ? changeRoute(`/landparcel/${lpData.id}/edit`)
            : setOpenVerifyLPModal(true);
        }}
        handleSubBtnClick={() => {
          !(lpData?.farmer && lpData?.farmer?.personalDetails?.firstName)
            ? setOpenAddFarmerModal(true)
            : lpData?.status == 'Draft' ||
              lpData?.status == 'Review Failed' ||
              lpData?.status == 'Validation Failed'
              ? changeRoute(`/landparcel/${lpData.id}/edit`)
              : changeRoute(`/landparcel/${lpData.id}/create-event`);
        }}
      />
      <Grid direction='column' container>
        <Tabs
          labelList={labelList}
          componentList={componentList}
          headerContent={
            <If value={process.env.NEXT_PUBLIC_APP_NAME === 'praanaos'}>
              <Box
                sx={{
                  alignItems: 'top',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  position: 'relative',
                  top: 5,
                }}
              >
                <Donut
                  color={theme.palette.chart.primary}
                  series={[lpData?.climateScore || 0, 100 - (lpData?.climateScore || 0)]}
                />
                <Box>
                  <Typography
                    color='textPrimary'
                    variant='body1'
                    fontWeight={550}
                    sx={{
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {lpData?.climateScore} %
                  </Typography>
                  <Typography
                    color='textSecondary'
                    variant='caption'
                    sx={{
                      position: 'relative',
                      top: '-8px',
                      padding: 0,
                      marginTop: 0,
                    }}
                  >
                    Climate Impact Score
                  </Typography>
                </Box>
                <Donut
                  color={theme.palette.chart.secondary}
                  series={[lpData?.complianceScore || 0, 100 - (lpData?.complianceScore || 0)]}
                />
                <Box>
                  <Typography color='textPrimary' variant='body1' fontWeight={550}>
                    {lpData?.complianceScore} %
                  </Typography>
                  <Typography
                    color='textSecondadry'
                    variant='caption'
                    sx={{
                      position: 'relative',
                      top: '-8px',
                      padding: 0,
                      marginTop: 0,
                    }}
                  >
                    Compliance Score
                  </Typography>
                </Box>
              </Box>
            </If>
          }
          sx={{
            padding: '1.5rem 0',
          }}
        />
      </Grid>
      {openAddFarmerModal && (
        <Dialog open={openAddFarmerModal} onClose={handleClose} maxWidth={'md'}>
          <FarmerEditor
            formData={{
              data: {
                leaseDocuments: lpData?.leaseDocuments,
                ownership: lpData?.ownership,
                farmer: lpData?.farmer?.id
              }
            }}
            onSubmit={handleAddFarmerSubmit}
            formContext={formContext} />
        </Dialog>
      )}
      {openAddProcessorModal && (
        <Dialog open={openAddProcessorModal} onClose={handleClose} maxWidth={'md'}>
          <ProcessorEditor
            formData={{
              data: {
                processor: lpData?.processor?.id
              }
            }}
            onSubmit={handleAddProcessorSubmit}
            formContext={formContext} />
        </Dialog>
      )}
      <>
        <Grid container>
          <Grid ref={parentRef} item xs={10}>
            <Drawer
              sx={styles.rightDrawer(parentRef)}
              anchor={'right'}
              open={openVerifyLPModal}
              onClose={handleClose}
            >
              <div style={{ padding: 20 }}>
                <ValidationWorkflowView
                  domainObjectId={lpId}
                  domainSchemaName={'landparcel'}
                  wfId={lpData?.validationWorkflowId}
                  reload={() => reFetch(API_URL)}
                  closeDrawer={handleClose}
                />
              </div>
            </Drawer>
          </Grid>
        </Grid>
      </>
    </CircularLoader>
  );
}