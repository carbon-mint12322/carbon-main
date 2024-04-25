// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'

import React, { useState } from 'react';
import axios from 'axios';
import { useAlert } from '~/contexts/AlertContext';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { SxProps } from '@mui/material';
import AquaPopEvent from '~/container/aquapop/details/aquapopevent';
import Tabs from '~/components/lib/Navigation/Tabs';
import Events from '~/container/crop/details/Events';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { AquaPOP, PageConfig } from '~/frontendlib/dataModel';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import landParcelIcon from '/public/assets/images/landParcelIcon.svg';
import TabSubNav from '~/container/TabSubNav';
import Dialog from '~/components/lib/Feedback/Dialog';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';

export { default as getServerSideProps } from '~/utils/ggsp';

interface AquaPOPDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: AquaPOP;
}

const SupportingDocumentsEditor = dynamic(
  import('~/gen/data-views/supportingDocuments/supportingDocumentsEditor.rtml'),
);

const AquaPop_basicinfoEditor = dynamic(
  import('~/gen/data-views/aquapop_basicinfo/aquapop_basicinfoEditor.rtml'),
);
const ControlPointEditor = dynamic(
  import('~/gen/data-views/add_controlpoint/add_controlpointEditor.rtml'),
);

export default function AquaPOPDetails(props: AquaPOPDetailsProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const router = useRouter();
  const { openToast } = useAlert();
  const { operator, getAPIPrefix } = useOperator();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isMainBtnPresent: false,
    isAvatarIconPresent: false,
    titleIcon: landParcelIcon.src,
    isSearchBarPresent: false,
  });

  const API_URL = `${getAPIPrefix()}/aquapop/${router.query.id}`;

  const { isLoading: loading, data: aquapopData, reFetch } = useFetch<AquaPOP>(API_URL);

  const data = aquapopData;

  const handleClose = () => {
    setOpenModal(null);
  };

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      title: data?.name,
      subTitle:
        data?.aquaPopType.aquaType +
        ' • ' +
        (data?.aquaPopType?.scheme ? data?.aquaPopType?.scheme : ''),
    });
  }, [data]);

  const labelList = [
    {
      label: `Info`,
    },
    {
      label: 'Events',
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
    { title: 'Crop', subText: data?.aquaPopType?.aquaType },
    { title: 'Crop Variety', subText: data?.aquaPopType?.variety },
    {
      title: 'Region',
      subText: data?.aquaPopType.region,
    },
    {
      title: 'Aqua Duration',
      subText:
        typeof data?.aquaPopType.durationDays === 'number'
          ? data.aquaPopType.durationDays.toString()
          : data?.aquaPopType.durationDays,
    },
  ];

  const supportingDocuments = data?.documents?.map((doc: any) => ({
    title: doc.documentType,
    subText: doc.documentDetails,
    url: doc.documentEvidence,
  }));

  const componentData = [
    {
      label: 'Basic Info',
      data: basicInfo,
      title: 'Basic Info',
      onClick: () => setOpenModal('basicInfo'),
    },
    {
      label: 'Supporting Documents',
      data: supportingDocuments,
      title: 'Supporting Documents',
      onClick: () => setOpenModal('supportingDocuments'),
    },
  ];

  const { getApiUrl } = useOperator();
  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/aquapop/${router.query.id}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'AquaPOP details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update AquaPOP details');
      console.log(error);
    }
  };

  const handleAddControlPointFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/aquapop/${router.query.id}`);

      const newData = { ...data };

      const newControlPoints = newData?.aquaControlPoints ? [...newData.aquaControlPoints] : [];
      newControlPoints.push(formData.addCP);
      if (newData?.aquaControlPoints) {
        newData.aquaControlPoints = newControlPoints;
      }

      //console.log('Updated data', newData);
      delete newData._id;

      await axios
        .post(apiUrl, {
          ...newData,
        })
        .then((res) => {
          openToast('success', 'AquaPOP details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update AquaPOP details');
      console.log(error);
    }
  };

  const componentList = [
    {
      component: TabSubNav,
      props: { data: componentData },
    },
    {
      component: AquaPopEvent,
      props: {
        data: data,
        onClick: () => setOpenModal('controlPoint'),
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

  const renderModal = () => {
    switch (openModal) {
      case 'basicInfo':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <AquaPop_basicinfoEditor
              formData={{
                data: data,
              }}
              onSubmit={handleFormSubmit}
            />
          </Dialog>
        );

      case 'supportingDocuments':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <SupportingDocumentsEditor
              formData={{
                data: {
                  documents: data?.documents,
                },
              }}
              onSubmit={handleFormSubmit}
              onCancelBtnClick={handleClose}
            />
          </Dialog>
        );

      case 'controlPoint':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <ControlPointEditor
              formData={{
                data: { data },
              }}
              onSubmit={handleAddControlPointFormSubmit}
              onCancelBtnClick={handleClose}
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
