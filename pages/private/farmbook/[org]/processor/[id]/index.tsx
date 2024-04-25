// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/processorDetails/ui'
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Grid, SxProps } from '@mui/material';
import Drawer from '@mui/material/Drawer';

import Tabs from '~/components/lib/Navigation/Tabs';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { Processor, PageConfig } from '~/frontendlib/dataModel';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import axios from 'axios';
import Dialog from '~/components/lib/Feedback/Dialog';
import { useUser } from '~/contexts/AuthDialogContext';
import dayjs from 'dayjs';
import ValidationWorkflowView from '~/components/workflow/ValidationWorkflowView';
import styles from '~/styles/theme/brands/styles';
import { useAlert } from '~/contexts/AlertContext';

export { default as getServerSideProps } from '~/utils/ggsp';

const LandParcelsList = dynamic(() => import('~/container/farmer/details/LandParcelsList'));
const ProcessorDetailsBioVerticalTabs = dynamic(
  () => import('~/container/processor/details/ProcessorDetailsBioVerticalTabs'),
);
const OperatorDetailsBioVerticalTabs = dynamic(
  () => import('~/container/processor/details/OperatorDetailsBioVerticalTabs'),
);

interface ProcessorDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Processor;
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

export default function ProcessorDetails(props: ProcessorDetailsProps) {
  const router = useRouter();
  const { user } = useUser();
  const { operator, changeRoute, getApiUrl } = useOperator();
  const [openVerifyProcessorModal, setOpenVerifyProcessorModal] = useState<boolean>(false);
  const parentRef = useRef(null);
  const { openToast } = useAlert();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isTitleBtnPresent: true,
    isMainBtnPresent: true,
    isAvatarIconPresent: true,
    isSearchBarPresent: false,
  });

  const processorId = router.query.id as string;
  const dataUrl = getApiUrl(`/processor/${processorId}`);
  const modelName = `farmer`
  const { isLoading: loading, data: processorData, reFetch } = useFetch<Processor[]>(dataUrl);

  const handleClose = () => {
    setOpenVerifyProcessorModal(false);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/farmer/${processorId}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Processor details updated');
          setOpenModal(null);
        });
      reFetch(dataUrl);
      openToast('success', 'Processor details updated');
    } catch (error: any) {
      openToast('error', 'Failed to update processor details');
      console.log(error);
    }
  };

  const handleIdentityDetailsSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/farmer/${processorId}`);
      await axios.post(apiUrl, {
        personalDetails: { ...data?.personalDetails, identityDetails: formData.identityDetails },
      });
      reFetch(dataUrl);
      openToast('success', 'Processor details updated');
    } catch (error: any) {
      console.log(error);
    }
  };

  const data = processorData?.[0];
  React.useEffect(() => {
    let lastname =
      data?.personalDetails?.lastName === undefined ? '' : data?.personalDetails?.lastName;
    if (data) {
      setTitleBarData({
        ...titleBarData,
        title: data?.personalDetails?.firstName + ' ' + lastname,
        subTitle: data?.personalDetails?.primaryPhone
          ? data?.personalDetails?.primaryPhone + ' • ' + data?.personalDetails?.address?.village
          : data?.personalDetails?.address?.village,
        mainBtnTitle:
          data?.status == 'Approved'
            ? 'Approved'
            : statusStep[data?.status]?.buttonLabel || 'Verify Processor',
        titleButtonColor:
          data?.status == 'Approved' ? 'success' : data?.status == 'Declined' ? 'error' : 'warning',
        titleBtnText: data?.status || 'Draft',
        avatarIcon: data?.personalDetails?.firstName + ' ' + lastname,
        url: data?.personalDetails?.profilePicture,
      });
    }
  }, [data]);

  const labelList = [
    {
      label: `Processor Bio`,
    },
    {
      label: `Land Parcels (${data?.landParcels ? data?.landParcels?.length : 0})`,
    },
    {
      label: `Operator`,
    },
    {
      label: 'History',
      data: data,
      title: 'History',
    },
  ];

  const componentList = [
    {
      component: ProcessorDetailsBioVerticalTabs,
      props: {
        data: data,
        handleFormSubmit: handleFormSubmit,
        handleIdentityDetailsSubmit: handleIdentityDetailsSubmit,
        reFetch: () => reFetch(dataUrl),
      },
    },
    {
      component: LandParcelsList,
      props: { data: data?.landParcels },
    },

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
        handleMainBtnClick={() => { setOpenVerifyProcessorModal(true); }}
      />
      <Tabs labelList={labelList} componentList={componentList} />
      <>
        <Grid container>
          <Grid ref={parentRef} item xs={10}>
            <Drawer
              sx={styles.rightDrawer(parentRef)}
              anchor={'right'}
              open={openVerifyProcessorModal}
              onClose={handleClose}
            >
              <div style={{ padding: 20 }}>
                <ValidationWorkflowView
                  domainObjectId={processorId}
                  domainSchemaName={'processor'}
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
