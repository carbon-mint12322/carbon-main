// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'

import React, { useState, useMemo, useRef } from 'react';
import axios from 'axios';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { SxProps } from '@mui/material';
import { useTheme, Grid } from '@mui/material';

import Drawer from '@mui/material/Drawer';
import styles from '~/styles/theme/brands/styles';
import Tabs from '~/components/lib/Navigation/Tabs';
import ValidationWorkflowView from '~/components/workflow/ValidationWorkflowView';

import { QRCode } from '~/frontendlib/QR/QRCode';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { User, PageConfig, CropEvent, CollectiveTransactionCert } from '~/frontendlib/dataModel';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import { useAlert } from '~/contexts/AlertContext';
import TabSubNav from '~/container/TabSubNav';
import Events from '~/container/landparcel/details/Events';
import Dialog from '~/components/lib/Feedback/Dialog';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import FarmerSubmission from '~/container/crop/details/FarmerSubmission';
export { default as getServerSideProps } from '~/utils/ggsp';
import landParcelIcon from '/public/assets/images/landParcelIcon.svg';
import cropImg from '/public/assets/images/crop.svg';

interface CollectiveTransactionCertProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: CollectiveTransactionCert;
}

export default function CollectiveTransactionCertDetails(props: CollectiveTransactionCertProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const router = useRouter();
  const { openToast } = useAlert();
  const parentRef = useRef(null);
  const { operator, getAPIPrefix } = useOperator();
  const collectiveTCId = router?.query?.id as string;
  const [openVerifyCollectiveModal, setOpenVerifyCollectiveModal] = useState<boolean>(false);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isTitleIconPresent: true,
    isTitleBtnPresent: true,
    isMainBtnPresent: false,
    titleIcon: cropImg.src,
    isSearchBarPresent: false,
    subBtnColor: 'secondary',
    isSubBtnPresent: true,
    subBtnDisabled: false,
  });
  const API_URL = getAPIPrefix() + `/transactioncertificate/${router.query.tcId}`;
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);
  const handleClose = () => {
    setOpenModal(null);
    setOpenVerifyCollectiveModal(false);
  };

  const CollectiveTransactionCertEditor = dynamic(
    import(
      '~/gen/data-views/add_collectivetransactioncert/add_collectivetransactioncertEditor.rtml'
    ),
  );

  const collectiveTCData = data;

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      title: data?.fbId,
      subTitle: data?.lotNo + ' • ' + data?.collectives?.[0]?.name,
      titleBtnText: data?.status || 'Draft',
      titleButtonColor:
        data?.status == 'Approved' ? 'success' : data?.status == 'Declined' ? 'error' : 'warning',
      subBtnTitle:
        data?.status == 'Approved'
          ? 'Approved'
          : statusStep[data?.status]?.buttonLabel || 'Verify TC',
    });
  }, [data]);

  const labelList = [
    {
      label: `Transaction Certificate Info`,
    },
    {
      label: 'History',
    },
  ];

  const basicInfo = [
    {
      title: 'ID',
      subText: data?.fbId,
    },
    {
      title: 'Lot Number',
      subText: data?.lotNo,
    },
    {
      title: 'Aggregation Plan',
      subText: data?.aggregationplan?.name,
    },
    {
      title: 'Certification Body',
      subText: data?.cb?.name,
    },
  ];

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
    Approved: {
      buttonLabel: 'Approved',
      step: 'basicinfo',
    },
  };

  const { getApiUrl } = useOperator();

  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/transactioncertificate/${router.query.tcId}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Transaction certificate details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update transaction certificate details');
      console.log(error);
    }
  };

  const componentData = [
    {
      label: 'Transaction Certificate Info',
      data: basicInfo,
      title: 'Basic Info',
      onClick: () => setOpenModal('basicInfo'),
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

  async function refFilter(options: any) {
    if (options?.uiOptions.filterKey === 'ngmoRecords') {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/collective/${router.query.id}`);
      return res.data?.[0]?.ngmoTestRecords;
    } else if (options?.uiOptions.filterKey === 'aggregationPlan') {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/collective/${router.query.id}`);
      return res.data?.[0]?.aggregationPlanDetails;
    } else {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `${options.schemaId}`);

      return res.data;
    }
  }

  const formContext: any = {
    getApiUrl,
    foreignObjectLoader: refFilter,
  };

  const renderModal = () => {
    switch (openModal) {
      case 'basicInfo':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <CollectiveTransactionCertEditor
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
        handleMainBtnClick={() => { setOpenVerifyCollectiveModal(true) }}
      />
      {data?.qrLink ? <QRCode link={data?.qrLink} /> : <></>}
      <Tabs labelList={labelList} componentList={componentList} />
      {renderModal()}{' '}
      <>
        <Grid container>
          <Grid ref={parentRef} item xs={10}>
            <Drawer
              sx={styles.rightDrawer(parentRef)}
              anchor={'right'}
              open={openVerifyCollectiveModal}
              onClose={handleClose}
            >
              <div style={{ padding: 20 }}>
                <ValidationWorkflowView
                  domainObjectId={collectiveTCId}
                  domainSchemaName={'transactioncertificate'}
                  wfId={collectiveTCData?.validationWorkflowId}
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
