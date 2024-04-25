// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { useAlert } from '~/contexts/AlertContext';
import Tabs from '~/components/lib/Navigation/Tabs';
import dynamic from 'next/dynamic';
import { CalendarBlank, Person } from '~/components/Icons';
import { SxProps, useTheme, Grid } from '@mui/material';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import { CertificationBody, PageConfig } from '~/frontendlib/dataModel';
import Dialog from '~/components/lib/Feedback/Dialog';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import TabSubNav from '~/container/TabSubNav';
import axios from 'axios';
import EntityUsersList from '~/components/lib/EntityUsersList';
const CBUserEditor = dynamic(import('~/gen/data-views/certificationbodyUser/certificationbodyUserEditor.rtml'));



export { default as getServerSideProps } from '~/utils/ggsp';

interface CertificationBodyDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: CertificationBody;
}

export default function CertificationBodyDetails(props: CertificationBodyDetailsProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();
  const { operator, getAPIPrefix } = useOperator();
  const { openToast } = useAlert();

  const API_URL = `${getAPIPrefix()}/certificationbody/${router.query.id}`;
  const { isLoading: loading, data: cbData, reFetch } = useFetch<CertificationBody>(API_URL);

  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isMainBtnPresent: false,
    isAvatarIconPresent: false,
    titleIcon: WorkspacePremiumOutlinedIcon,
    isSearchBarPresent: false,
  });

  const data = cbData;

  const SupportingDocumentsEditor = dynamic(
    import('~/gen/data-views/supportingDocuments/supportingDocumentsEditor.rtml'),
  );

  const CertificationBodySchemesEditor = dynamic(
    import('~/gen/data-views/certificationBodySchemes/certificationBodySchemesEditor.rtml'),
  );

  const Add_certificationbodyEditor = dynamic(
    import('~/gen/data-views/add_certificationbody/add_certificationbodyEditor.rtml'),
  );

  const handleClose = () => {
    setOpenModal(null);
  };

  React.useEffect(() => {
    setTitleBarData({
      title: data?.name,
      subTitle: data?.phone + ' • ' + (data?.address?.village ? data?.address?.village : ''),
    });
  }, [data]);

  const labelList = [
    {
      label: `Info`,
    },
    // {
    //   label: 'Users',
    //   icon: <Person color={theme.palette.iconColor.secondary} />,
    //   count: data?.users?.length ?? 0,
    // },
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
      title: 'Email',
      subText: data?.email,
    },
    {
      title: 'Phone',
      subText: data?.phone,
    },
    {
      title: 'Point of Contact',
      subText: data?.poc,
    },
    {
      title: 'Address',
      subText: data?.address?.village + ' ' + data?.address?.state + ' ' + data?.address?.pincode,
    },
    {
      title: 'Certification Authority',
      subText: data?.certificationAuthority,
    },
    {
      title: 'Registration Document',
      subText: 'Registration Document Reference',
      url: data?.registrationDocumentFile,
    },
  ];

  const schemes = [
    {
      title: 'Supports',
      subText: data?.schemes
        ?.map(function (scheme) {
          return scheme;
        })
        .join(', '),
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
      label: 'Schemes',
      data: schemes,
      title: 'Schemes',
      onClick: () => setOpenModal('schemes'),
    },
    {
      label: 'Supporting Documents',
      data: supportingDocuments,
      title: 'Supporting Documents',
      onClick: () => setOpenModal('supportingDocuments'),
    },
  ];

  const componentList = [
    {
      component: TabSubNav,
      props: { data: componentData },
    },
    // {
    //   component: EntityUsersList,
    //   props: { data: data?.users, modelName: 'certificationbody', entityId: router.query.id, reFetch: reFetch(API_URL), EntityUserEditor: CBUserEditor }
    // },
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

  const { getApiUrl } = useOperator();
  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/certificationbody/${router.query.id}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Certification body details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update certfication body details');
      console.log(error);
    }
  };

  const renderModal = () => {
    switch (openModal) {
      case 'basicInfo':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <Add_certificationbodyEditor
              formData={{ data }}
              onSubmit={handleFormSubmit}
              onCancelBtnClick={handleClose}
            />
          </Dialog>
        );

      case 'schemes':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <CertificationBodySchemesEditor
              formData={{
                data: {
                  schemes: data?.schemes,
                },
              }}
              onSubmit={handleFormSubmit}
              onCancelBtnClick={handleClose}
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
