import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Dialog from '~/components/lib/Feedback/Dialog';

import { Box, Typography, useTheme, SxProps } from '@mui/material';

import OverviewTab from '~/container/landparcel/details/OverviewTab';

import Tabs from '~/components/lib/Navigation/Tabs';
import {
  CalendarBlank,
  ChartLine,
  Cube,
  Stack,
  DownloadSimple,
  Files,
  Layout,
  Leaf,
  Leaf_green,
  Person,
  Ruler,
} from '~/components/Icons';
import Donut from '~/components/common/Chart/Donut';
import { Landscape } from '@mui/icons-material';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import fieldImg from '../../../../../../public/assets/images/crop.svg';
import mapStyles from '~/styles/theme/map/styles';
import { Field, PageConfig } from '~/frontendlib/dataModel';
import { coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import VerticalSplitOutlinedIcon from '@mui/icons-material/VerticalSplitOutlined';
import Document from '~/components/common/Document';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';
import axios from 'axios';

const CropListFarmerTable = dynamic(() => import('~/container/farmer/details/CropListFarmerTable'));

export { default as getServerSideProps } from '~/utils/ggsp';

export interface FieldDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Field;
}

export default function FieldDetails(props: any) {
  const router = useRouter();
  const theme = useTheme();
  const { changeRoute, getAPIPrefix } = useOperator();

  const [titleBarData, setTitleBarData] = React.useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isMainBtnPresent: false,
    titleIcon: fieldImg.src,
    isAvatarIconPresent: false,
    isSearchBarPresent: false,
    isTitleIconPresent: true,
  });

  const { isLoading: loading, data: fpData } = useFetch<Field>(
    `${getAPIPrefix()}/field/${router.query.id}`,
  );

  const data = fpData;

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      title: data?.name,
      subTitle:
        data?.landParcelDetails?.[0]?.name +
        ' • ' +
        (data?.landParcelDetails?.[0]?.address?.village
          ? data?.landParcelDetails?.[0]?.address.village
          : ''),
    });
  }, [data]);

  const fieldDetails = {
    id: data?.fbId,
    name: data?.name,
    landParcel: data?.landParcelDetails?.[0]?.name,
    farmer: {
      firstname: data?.farmer?.[0]?.personalDetails.firstName,
      lastname: data?.farmer?.[0]?.personalDetails.lastName,
    },
    landParcelMap: data?.landParcelDetails?.[0]?.map,
    fieldMap: data?.map,
    location: data?.landParcelDetails?.[0]?.location,
    areaInAcres: data?.areaInAcres,
  };

  const overviewData = {
    areaInAcres: data?.areaInAcres,
    calculatedAreaInAcres: data?.calculatedAreaInAcres,
    fieldId: data?.fbId,
    fieldType: data?.fieldType,
    landParcel: data?.landParcelDetails?.[0]?.name,
    farmer: data?.farmer?.[0]
      ? data?.farmer?.[0]?.personalDetails.firstName +
      ' ' +
      data?.farmer?.[0]?.personalDetails.lastName
      : '',
    center: data?.landParcelDetails?.[0]?.location,
    polygons: [
      {
        paths: coordinateStringToCoordinateObject(fieldDetails?.fieldMap || ''),
        options: { ...mapStyles.fieldMap },
      },
    ],
    landPolygon: {
      paths: coordinateStringToCoordinateObject(fieldDetails?.landParcelMap || ''),
      options: { ...mapStyles.landParcelMap },
    },
  };

  const overviewDataList = [
    {
      icon: <Layout color={theme.palette.iconColor.tertiary} />,
      title: 'ID',
      value: overviewData.fieldId,
    },
    {
      icon: <Ruler color={theme.palette.iconColor.default} />,
      title: 'Area',
      value: overviewData.areaInAcres?.toString().concat(' acre(s)'),
    },
    {
      icon: <Stack color={theme.palette.iconColor.default} />,
      title: 'Type',
      value: overviewData.fieldType ? overviewData.fieldType : 'Open field',
    },
    {
      icon: <Landscape sx={{ color: theme.palette.iconColor.quaternary }} />,
      title: 'Calculated Area',
      value: overviewData.calculatedAreaInAcres?.toString().concat(' acre(s)'),
    },
    {
      icon: <Stack color={theme.palette.iconColor.primary} />,
      title: 'Land Parcel',
      value: overviewData.landParcel,
    },
    {
      icon: <Person color={theme.palette.iconColor.primary} />,
      title: 'Farmer',
      value: overviewData.farmer,
    },
  ];

  const labelList = [
    {
      label: 'Overview',
      icon: <Cube color={theme.palette.iconColor.default} />,
    },
    {
      label: ` Crops (${data?.crops ? data?.crops?.length : 0})`,
      icon: <Leaf_green color={theme.palette.iconColor.primary} />,
    },
  ];

  const componentList = [
    {
      component: OverviewTab,
      props: {
        data: overviewData,
        overviewDataList: overviewDataList,
        kmlString: data?.map,
        kmlName: data?.name,
      },
    },
    {
      component: CropListFarmerTable,
      props: { data: data?.crops, isFarmerDetails: true },
    },
  ];

  return (
    <CircularLoader value={loading}>
      <TitleBarGeneric
        titleBarData={titleBarData}
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
          ></Box>
        }
      />
    </CircularLoader>
  );
}
