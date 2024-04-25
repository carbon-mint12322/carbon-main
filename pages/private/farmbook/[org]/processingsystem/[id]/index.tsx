// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'

import React, { useState } from 'react';
import axios from 'axios';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { SxProps } from '@mui/material';
import { World } from '~/components/Icons';

import Tabs from '~/components/lib/Navigation/Tabs';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { User, PageConfig, CropEvent, ProcessingSystem } from '~/frontendlib/dataModel';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import { useAlert } from '~/contexts/AlertContext';
import TabSubNav from '~/container/TabSubNav';
import Events from '~/container/landparcel/details/Events';
import ImpactComponent from '~/container/landparcel/details/Impact';
import ProcessingSystemEvents from '~/container/landparcel/details/ProcessingSystemEvents';
import Dialog from '~/components/lib/Feedback/Dialog';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import FarmerSubmission from '~/container/crop/details/FarmerSubmission';
export { default as getServerSideProps } from '~/utils/ggsp';

interface ProcessingSystemProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: ProcessingSystem;
}

export default function ProcessingSystemDetails(props: ProcessingSystemProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const router = useRouter();
  const { openToast } = useAlert();

  const { operator, getAPIPrefix } = useOperator();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isMainBtnPresent: false,
    isAvatarIconPresent: true,
    isSearchBarPresent: false,
  });

  const API_URL = getAPIPrefix() + `/processingsystem/${router.query.id}`;
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);
  const handleClose = () => {
    setOpenModal(null);
  };

  const ProcessingSystemEditor = dynamic(
    import('~/gen/data-views/add_processingsystem/add_processingsystemEditor.rtml'),
  );
  const lpData = data;
  const psDetails = {
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
      label: `Processing System Info`,
    },
    {
      label: `Events`,
    },
    {
      label: `Farmer Submission`,
    },
    {
      label: 'Impact',
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
      const apiUrl = getApiUrl(`/processingsystem/${router.query.id}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Processing system details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update processing system details');
      console.log(error);
    }
  };

  const componentData = [
    {
      label: 'Processing System Info',
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

  const componentList = [
    {
      component: TabSubNav,
      props: { data: componentData },
    },
    {
      component: ProcessingSystemEvents,
      props: {
        data: lpData,
        eventData: {
          data: lpData?.events?.filter(
            (event: any) =>
              event.processingSystemId === router.query.id && event.category !== 'Submission',
          ),
          eventType: 'Calendar',
          processingSystemId: router.query.id,
          processingSystemCategory: data?.category?.toLowerCase(),
        },
        landParcelMap: psDetails?.landParcelMap,
        fieldMap: data?.map,
      },
    },
    {
      component: FarmerSubmission,
      props: {
        type: 'Processing System',
        eventData: {
          data: data?.events?.filter((event: CropEvent) => event.category === 'Submission'),
          eventType: 'Submission',
          onclick: {},
        },
        landParcelMap: psDetails?.landParcelMap,
        fieldMap: data?.map,
      },
    },
    {
      component: ImpactComponent,
      props: { lpData, handleFormSubmit: handleFormSubmit, reFetch: reFetch },
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
            <ProcessingSystemEditor
              formData={{ data: data }}
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
