// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Grid, SxProps } from '@mui/material';
import Drawer from '@mui/material/Drawer';

import Tabs from '~/components/lib/Navigation/Tabs';

import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import { Farmer, PageConfig } from '~/frontendlib/dataModel';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import axios from 'axios';
import { useUser } from '~/contexts/AuthDialogContext';
import ValidationWorkflowView from '~/components/workflow/ValidationWorkflowView';
import styles from '~/styles/theme/brands/styles';
import { useAlert } from '~/contexts/AlertContext';
import TitleBarGeneric from '~/components/TitleBarGeneric';

export { default as getServerSideProps } from '~/utils/ggsp';

const CropListFarmerTable = dynamic(() => import('~/container/farmer/details/CropListFarmerTable'));
const LandParcelsList = dynamic(() => import('~/container/farmer/details/LandParcelsList'));
const FarmerDetailsBioVerticalTabs = dynamic(
  () => import('~/container/farmer/details/FarmerDetailsBioVerticalTabs'),
);
const OperatorDetailsBioVerticalTabs = dynamic(
  () => import('~/container/farmer/details/OperatorDetailsBioVerticalTabs'),
);

interface FarmerDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Farmer;
}

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
};

export default function FarmerDetails(props: FarmerDetailsProps) {
  const router = useRouter();
  const { user } = useUser();
  const { operator, changeRoute, getApiUrl } = useOperator();
  const [openVerifyFarmerModal, setOpenVerifyFarmerModal] = useState<boolean>(false);
  const parentRef = useRef(null);
  const { openToast } = useAlert();
  const [openModal, setOpenModal] = useState<string | null>(null);

  const farmerId = router.query.id as string;
  const dataUrl = getApiUrl(`/farmer/${farmerId}`);
  const modelName = `farmer`
  const { isLoading: loading, data: farmerData, reFetch } = useFetch<Farmer>(dataUrl);
  const [currentHorizontalTab, setCurrentHorizontalTab] = useState<string | number>('');
  const data = farmerData;

  const [titleBarData, setTitleBarData] = useState<any>();

  const mainBtnOptionsTemplate = [
    {
      label: 'Download OSP Template',
      operation: () => getFarmerOSPTemplate(),
    },
  ];

  const handleClose = () => {
    setOpenVerifyFarmerModal(false);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/farmer/${farmerId}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Farmer details updated');
          setOpenModal(null);
        });
      reFetch(dataUrl);
      openToast('success', 'Farmer details updated');
    } catch (error: any) {
      openToast('error', 'Failed to update farmer details');
      console.log(error);
    }
  };

  const handleIdentityDetailsSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/farmer/${farmerId}`);
      await axios.post(apiUrl, {
        personalDetails: { ...data?.personalDetails, identityDetails: formData.identityDetails },
      });
      reFetch(dataUrl);
      openToast('success', 'Farmer details updated');
    } catch (error: any) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    let lastname =
      data?.personalDetails?.lastName === undefined ? '' : data?.personalDetails?.lastName;
    setTitleBarData({
      isTitleBarPresent: true,
      title: data?.personalDetails?.firstName + ' ' + lastname,
      subTitle: data?.personalDetails?.primaryPhone
        ? data?.personalDetails?.primaryPhone + ' • ' + data?.personalDetails?.address?.village
        : data?.personalDetails?.address?.village,
      mainBtnTitle:
        data?.status == 'Approved'
          ? 'Approved'
          : statusStep[data?.status || '']?.buttonLabel || 'Verify Farmer',
      mainBtnOptions: [],
      isTitlePresent: true,
      isSubTitlePresent: true,
      isTitleBtnPresent: true,
      titleButtonColor:
        data?.status == 'Approved' ? 'success' : data?.status == 'Declined' ? 'error' : 'warning',
      titleBtnText: data?.status === 'editable' ? 'Draft' : data?.status,
      isMainBtnPresent: true,
      isAvatarIconPresent: true,
      avatarIcon: data?.personalDetails?.firstName + ' ' + lastname,
      url: data?.personalDetails?.profilePicture,
      isSearchBarPresent: false,
    });
  }, [data]);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      mainBtnOptions: currentHorizontalTab === 'Operator' ? mainBtnOptionsTemplate : [],
    });
  }, [currentHorizontalTab]);

  const getFarmerOSPTemplate = () => {
    console.log('geeting osp tempalte for farmer');
  };

  const labelList = [
    {
      label: `Farmer Bio`,
    },
    {
      label: `Land Parcels (${data?.landParcels ? data?.landParcels?.length : 0})`,
    },
    ...(process.env.NEXT_PUBLIC_APP_NAME === 'farmbook'
      ? [
        {
          label: `Crops (${data?.crops ? data?.crops?.length : 0})`,
        },
      ]
      : []),
    {
      label: `Operator`,
    },
    {
      label: 'History',
      data: data,
      title: 'History',
    },
  ];
  const getCurrentHorizontalTab = (currentTab: { label: string | number }) =>
    setCurrentHorizontalTab(currentTab.label);

  const componentList = [
    {
      component: FarmerDetailsBioVerticalTabs,
      props: {
        data: data,
        handleFormSubmit: handleFormSubmit,
        handleIdentityDetailsSubmit: handleIdentityDetailsSubmit,
        reFetch: () => reFetch(dataUrl),
        modelName
      },
    },
    {
      component: LandParcelsList,
      props: { data: data?.landParcels },
    },
    ...(process.env.NEXT_PUBLIC_APP_NAME === 'farmbook'
      ? [
        {
          component: CropListFarmerTable,
          props: { data: data?.crops, isFarmerDetails: true },
        },
      ]
      : []),

    {
      component: OperatorDetailsBioVerticalTabs,
      props: {
        data: data,
        handleFormSubmit: handleFormSubmit,
        handleIdentityDetailsSubmit: handleIdentityDetailsSubmit,
        reFetch: () => reFetch(dataUrl),
        modelName
      },
    },
    {
      component: EntityHistoryCard,
      props: {
        data: {
          history: data?.histories,
          collective: operator,
        },
      },
    },
  ];
  return (
    <CircularLoader value={loading}>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleMainBtnClick={() => {
          setOpenVerifyFarmerModal(true);
        }}
      />
      <Tabs
        labelList={labelList}
        componentList={componentList}
        getCurrentTab={getCurrentHorizontalTab}
      />
      <>
        <Grid container>
          <Grid ref={parentRef} item xs={10}>
            <Drawer
              sx={styles.rightDrawer(parentRef)}
              anchor={'right'}
              open={openVerifyFarmerModal}
              onClose={handleClose}
            >
              <div style={{ padding: 20 }}>
                <ValidationWorkflowView
                  domainObjectId={farmerId}
                  domainSchemaName={'farmer'}
                  wfId={data?.validationWorkflowId}
                  reload={() => reFetch(dataUrl)}
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
