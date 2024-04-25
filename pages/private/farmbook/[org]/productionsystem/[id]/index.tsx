// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'

import React, { useState } from 'react';
import axios from 'axios';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Box, Grid, IconButton, SxProps, Typography, useTheme } from '@mui/material';


import Tabs from '~/components/lib/Navigation/Tabs';
import {
  CalendarBlank,
} from '~/components/Icons';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { User, PageConfig, CropEvent, ProductionSystem } from '~/frontendlib/dataModel';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import { useAlert } from '~/contexts/AlertContext';
import TabSubNav from '~/container/TabSubNav';
import Events from '~/container/landparcel/details/Events';
import ProductionSystemEvents from '~/container/landparcel/details/ProductionSystemEvents';
import Dialog from '~/components/lib/Feedback/Dialog';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import FarmerSubmission from '~/container/poultry/details/FarmerSubmission';
export { default as getServerSideProps } from '~/utils/ggsp';
import getScheduledEventsData from "~/entitylib/functions/getData/getScheduledEventsData";
import ScheduledEvents from '~/components/lib/ScheduledEvents';


interface ProductionSystemProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: ProductionSystem;
}

export default function ProductionSystemDetails(props: ProductionSystemProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const router = useRouter();
  const { openToast } = useAlert();
  const { operator, getAPIPrefix } = useOperator();
  const theme = useTheme();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isMainBtnPresent: false,
    isAvatarIconPresent: true,
    isSearchBarPresent: false,
  });

  const API_URL = getAPIPrefix() + `/productionsystem/${router.query.id}`;
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);
  const { data: formData } = useFetch<any>(getAPIPrefix() + `/productionsystem/${router.query.id}?simple=true`);
  const handleClose = () => {
    setOpenModal(null);
  };

  function fetchData() {
    return reFetch(API_URL);
  }

  const ProductionSystemEditor = dynamic(
    import('~/gen/data-views/add_productionsystem/add_productionsystemEditor.rtml'),
  );
  const lpData = data;
  const cropDetails = {
    id: data?.id,
    name: data?.name,
    landParcel: data?.landParcels?.[0]?.name,
    fieldId: data?.fields?.[0]?.fbId,
    farmer: {
      id: data?.farmers?.[0]?.id,
      name: data?.farmers?.[0]?.name,
    },
    landParcelMap: data?.landParcels?.[0]?.map,
    category: data?.category,
  };

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      title: data?.name,
      subTitle:
        data?.landParcels?.[0]?.name + ' • ' + data?.fields?.[0]?.fbId + ' • ' + data?.category,
      avatarIcon: data?.name,
    });
  }, [data]);

  const fieldFilter = {
    landParcel: data?.landParcel,
  };

  const labelList = [
    {
      label: `Production System Info`,
    },
    {
      label: `Events`,
    },
    {
      label: `Farmer Submission`,
      count:
        data?.events?.filter((event: CropEvent) => event.category === 'Submission')?.length ?? 0,
    },
    {
      label: 'Scheduled Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      count: lpData?.plan[0]?.events?.length ?? 0,
    },
    {
      label: 'History',
    },
  ];

  const basicInfo = [
    {
      title: 'Name',
      subText: data?.name,
    },
    {
      title: 'Category',
      subText: data?.category,
    },
    {
      title: 'Land Parcel',
      subText: data?.landParcels?.[0].name,
    },
    {
      title: 'Field Parcel',
      subText: data?.fields?.[0].name,
    },
    {
      title: 'Village',
      subText: data?.landParcels?.[0].address
        ? data?.landParcels?.[0].address?.village
        : 'No data available',
    },
  ];

  const { getApiUrl } = useOperator();
  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/productionsystem/${router.query.id}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Production system updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update production system details');
      console.log(error);
    }
  };

  const componentData = [
    {
      label: 'Production System Info',
      data: basicInfo,
      title: 'Basic Info',
      onClick: () => setOpenModal('basicInfo'),
    },
  ];

  if (data?.category === 'Aquaculture') {
    const additionalInfo = [
      {
        title: 'Pond Type',
        subText: data?.pondType,
      },
      {
        title: 'Pond Depth',
        subText: data?.depth,
      },
      {
        title: 'Pond Shape',
        subText: data?.shape,
      },
      {
        title: 'Construction Date',
        subText: data?.constructionDate,
      },
      {
        title: 'Water Source',
        subText: data?.waterSource,
      },
      {
        title: 'Pond Infrastructure:',
        subText: '',
      },
      {
        title: 'Aeration System',
        subText: data?.aerationSystem ? 'Yes' : 'No',
      },
      {
        title: 'Feeding Area',
        subText: data?.feedingArea ? 'Yes' : 'No',
      },
      {
        title: 'Water Inlet',
        subText: data?.waterInlet ? 'Yes' : 'No',
      },
      {
        title: 'Water Outlet',
        subText: data?.waterOutlet ? 'Yes' : 'No',
      },
      {
        title: 'Shade Structures',
        subText: data?.shadeStructures ? 'Yes' : 'No',
      },
      {
        title: 'Other Infrastructure',
        subText: data?.otherInfra,
      },
    ];
    componentData.splice(2, 0, {
      label: 'Additional Info',
      data: additionalInfo,
      title: 'Additional Info',
      onClick: () => setOpenModal('basicInfo'),
    });
  }

  const componentList: any = [
    {
      component: TabSubNav,
      props: { data: componentData },
    },
    {
      component: ProductionSystemEvents,
      props: {
        data: lpData,
        eventData: {
          data: lpData?.events?.filter(
            (event: any) =>
              event.productionSystemId === router.query.id && event.category !== 'Submission',
          ),
          eventType: 'Calendar',
          productionSystemId: router.query.id,
          productionSystemCategory: data?.category?.toLowerCase(),
        },
        landParcelMap: cropDetails?.landParcelMap,
        fieldMap: data?.map,
      },
    },
    {
      component: FarmerSubmission,
      props: {
        type: 'Production System',
        eventData: {
          data: data?.events?.filter((event: CropEvent) => event.category === 'Submission'),
          eventType: 'Submission',
          onclick: {},
          productionSystemId: router.query.id,
          productionSystemCategory: data?.category?.toLowerCase(),
        },
        landParcelMap: cropDetails?.landParcelMap,
        fieldMap: data?.map,
      },
    },
    {
      label: 'Scheduled Events',
      icon: <CalendarBlank color={theme.palette.iconColor.secondary} />,
      count: data?.plan[0]?.events?.length ?? 0,
      component: ScheduledEvents,
      props: {
        ...getScheduledEventsData(data, 'productionsystem', fetchData),
      },
    },
    {
      component: EntityHistoryCard,
      props: {
        data: {
          history: data?.history,
          collective: operator,
        },
      },
    },
  ];

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'field': // this key is defined as ui:options in yaml
          return fieldFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  const renderModal = () => {
    switch (openModal) {
      case 'basicInfo':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <ProductionSystemEditor
              formData={{ data: formData }}
              onSubmit={handleFormSubmit}
              onCancelBtnClick={handleClose}
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
      />
      <Tabs labelList={labelList} componentList={componentList} />
      {renderModal()}{' '}
    </CircularLoader>
  );
}
