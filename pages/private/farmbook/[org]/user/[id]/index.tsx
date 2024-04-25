// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'

import React, { useState } from 'react';
import axios from 'axios';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { SxProps } from '@mui/material';

import Tabs from '~/components/lib/Navigation/Tabs';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { User, PageConfig } from '~/frontendlib/dataModel';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import { useAlert } from '~/contexts/AlertContext';
import TabSubNav from '~/container/TabSubNav';
import Dialog from '~/components/lib/Feedback/Dialog';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';

export { default as getServerSideProps } from '~/utils/ggsp';

const FarmerIdentityVerificationEditor = dynamic(
  import('~/gen/data-views/farmerIdentityVerification/farmerIdentityVerificationEditor.rtml'),
);

interface UserDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: User;
}

export default function UserDetails(props: UserDetailsProps) {
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

  const API_URL = `${getAPIPrefix()}/user/${router.query.id}`;

  const { isLoading: loading, data: userData, reFetch } = useFetch<User>(API_URL);

  const data = userData;

  const handleClose = () => {
    setOpenModal(null);
  };

  const SupportingDocumentsEditor = dynamic(
    import('~/gen/data-views/supportingDocuments/supportingDocumentsEditor.rtml'),
  );

  const UserRoleEditor = dynamic(import('~/gen/data-views/userRole/userRoleEditor.rtml'));
  const BasicUserDetailsEditor = dynamic(
    import('~/gen/data-views/basicUserDetails/basicUserDetailsEditor.rtml'),
  );

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      title:
        data?.personalDetails?.firstName +
        ' ' +
        (data?.personalDetails?.lastName ? data?.personalDetails?.lastName : ''),
      subTitle:
        data?.personalDetails?.primaryPhone +
        ' • ' +
        (data?.personalDetails?.address?.village ? data?.personalDetails?.address?.village : ''),
      avatarIcon:
        data?.personalDetails?.firstName +
        ' ' +
        (data?.personalDetails?.lastName ? data?.personalDetails?.lastName : ''),
    });
  }, [data]);

  const supportingDocuments = data?.documents?.map((doc: any) => ({
    title: doc.documentType,
    subText: doc.documentDetails,
    url: doc.documentEvidence,
  }));

  const labelList = [
    {
      label: `User Bio`,
    },
    {
      label: 'History',
    },
  ];

  const basicInfo = [
    {
      title: 'Name',
      subText:
        data?.personalDetails?.firstName +
        ' ' +
        (data?.personalDetails?.lastName ? data?.personalDetails?.lastName : ''),
    },
    {
      title: 'Email',
      subText: data?.personalDetails.email,
    },
    {
      title: 'Phone',
      subText: data?.personalDetails?.primaryPhone
        ? data?.personalDetails?.primaryPhone
        : 'No data available',
    },
    {
      title: 'Address',
      subText: data?.personalDetails?.address
        ? data?.personalDetails?.address?.village +
        ' ' +
        data?.personalDetails?.address?.state +
        ' ' +
        data?.personalDetails?.address?.pincode
        : 'No data available',
    },
  ];

  const getRoles = (data: any) => {
    let roles: any[] = [];
    data?.displayRoles.forEach((role: any) => {
      roles.push({ title: role.operator, subText: role.roles });
    });
    return roles;
  };

  const getFarmers = (data: any) => {
    let farmers: any[] = [];
    data?.agentItem?.farmer_details?.forEach((el: any) => {
      farmers.push({
        title:
          el.personalDetails.firstName +
          ' ' +
          (el?.personalDetails?.lastName ? el?.personalDetails?.lastName : ''),
      });
    });
    return farmers;
  };

  const IdVerificationData = [
    {
      title: 'Identification Number',
      subText: data?.personalDetails?.identityDetails?.identityNumber
        ? 'XXXX-XXXX-'.concat(
          data?.personalDetails?.identityDetails?.identityNumber
            ?.toString()
            .slice(
              data?.personalDetails?.identityDetails?.identityNumber?.toString().length - 4,
              data?.personalDetails?.identityDetails?.identityNumber?.toString(),
            ),
        )
        : 'NA',
    },
    {
      subText: `Identification Document: ${data?.personalDetails?.identityDetails?.identityDocument
        ? data?.personalDetails?.identityDetails?.identityDocument
        : 'NA'
        }`,
      url: data?.personalDetails?.identityDetails?.identityDocumentFile,
    },
    {
      title: 'PAN Card Number',
      subText: data?.personalDetails?.identityDetails?.panCardNumber,
    },
    {
      subText: 'PAN Card',
      url: data?.personalDetails?.identityDetails?.panCardFile,
    },
  ];

  const { getApiUrl } = useOperator();
  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/user/${router.query.id}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'User details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update user details');
      console.log(error);
    }
  };

  const componentData = [
    {
      label: 'Basic Info',
      data: basicInfo,
      title: 'Basic Info',
      onClick: () => setOpenModal('basicInfo'),
    },
    {
      label: 'ID & Verification',
      data: IdVerificationData,
      title: 'ID & Verification',
      onClick: () => setOpenModal('idVerification'),
    },
    {
      label: 'Roles',
      data: getRoles(data),
      title: 'Roles',
      onClick: () => setOpenModal('roles'),
    },
    {
      label: 'Supporting Documents',
      data: supportingDocuments,
      title: 'Supporting Documents',
      onClick: () => setOpenModal('supportingDocuments'),
    },
    {
      label: 'Assigned Farmers',
      data: getFarmers(data),
      showEditButton: false,
      title: 'Assigned Farmers',
    },
  ];

  const componentList = [
    {
      component: TabSubNav,
      props: { data: componentData },
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

  const handleIdentityDetailsSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/user/${data?._id}`);
      await axios.post(apiUrl, {
        personalDetails: { ...data?.personalDetails, identityDetails: formData.identityDetails },
      });
      reFetch(API_URL);
      openToast('success', 'User details updated');
    } catch (error: any) {
      console.log(error);
    }
    setOpenModal(null);
  };

  const renderModal = () => {
    switch (openModal) {
      case 'basicInfo':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <BasicUserDetailsEditor
              formData={{
                data: {
                  personalDetails: data?.personalDetails,
                  reportsTo: data?.reportsTo,
                },
              }}
              onSubmit={handleFormSubmit}
              onCancelBtnClick={handleClose}
            />
          </Dialog>
        );

      case 'roles':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <UserRoleEditor
              formData={{
                data: {
                  roles: data?.rolesCopy,
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

      case 'idVerification':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <FarmerIdentityVerificationEditor
              formData={{
                data: {
                  identityDetails: data?.personalDetails.identityDetails,
                },
              }}
              onSubmit={handleIdentityDetailsSubmit}
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
