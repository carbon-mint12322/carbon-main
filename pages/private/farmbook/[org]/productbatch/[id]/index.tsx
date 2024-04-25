// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { useEffect } from 'react';
import { useAlert } from '~/contexts/AlertContext';
import Tabs from '~/components/lib/Navigation/Tabs';
import dynamic from 'next/dynamic';
import Drawer from '@mui/material/Drawer';
import { QRCode } from '~/frontendlib/QR/QRCode';
import Image from 'next/image';
import styles from '~/styles/theme/brands/styles';
import { IconButton, Popover } from '@mui/material';
import { WhatsApp } from '~/components/Icons';
import { Telegram } from '~/components/Icons';
import { Gmail } from '~/components/Icons';
import { Box, Typography, useTheme, SxProps, Grid } from '@mui/material';
import { Link, Download } from '@mui/icons-material';
import ValidationWorkflowView from '~/components/workflow/ValidationWorkflowView';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import { PageConfig, ProductBatch } from '~/frontendlib/dataModel';
import Dialog from '~/components/lib/Feedback/Dialog';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import TabSubNav from '~/container/TabSubNav';
import axios from 'axios';
import ProductBatchEvents from '~/container/productbatch/Events';
import Product from '../../../../../../public/assets/images/Product.svg';

export { default as getServerSideProps } from '~/utils/ggsp';

interface ProductBatchDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: ProductBatch;
}

export default function ProductBatchDetails(props: ProductBatchDetailsProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const router = useRouter();
  const parentRef = useRef(null);

  const [openVerifyProductBatchModal, setOpenVerifyProductBatchModal] = useState<boolean>(false);
  const { operator, getAPIPrefix } = useOperator();
  const { openToast } = useAlert();
  const productBatchId = router?.query?.id as string;
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isTitleIconPresent: true,
    isTitleBtnPresent: true,
    isAvatarIconPresent: false,
    titleIcon: Product.src,
    isSearchBarPresent: false,
  });

  const API_URL = `${getAPIPrefix()}/productbatch/${router.query.id}`;
  const { isLoading: loading, data: productBatchData, reFetch } = useFetch<ProductBatch>(API_URL);

  const data = productBatchData;

  const Add_productBatchEditor = dynamic(
    import('~/gen/data-views/add_productBatch/add_productBatchEditor.rtml'),
  );

  const handleClose = () => {
    setOpenModal(null);
    setOpenVerifyProductBatchModal(false);
  };

  const statusStep: {
    [key: string]: {
      buttonLabel: string;
    };
  } = {
    Draft: {
      buttonLabel: 'Submit for Review',
    },
    'Under Review': {
      buttonLabel: 'Review & Approve',
    },
    'Under Validation': {
      buttonLabel: 'Validate',
    },
    'Review Failed': {
      buttonLabel: 'Submit for Review',
    },
    'Validation Failed': {
      buttonLabel: 'Submit for Review',
    },
    Approved: {
      buttonLabel: 'Approved',
    },
  };

  React.useEffect(() => {
    if (data) {
      setTitleBarData({
        ...titleBarData,
        title: data?.batchId,
        subTitle:
          data?.productItem?.name +
          ' • ' +
          (data?.productItem?.category ? data?.productItem?.category : ''),
        mainBtnTitle:
          data?.status == 'Approved'
            ? 'Approved'
            : statusStep[data?.status]?.buttonLabel || 'Verify Product Batch',
        isMainBtnPresent: data?.status !== 'Completed',
        titleButtonColor:
          data?.status == 'Approved' ? 'success' : data?.status == 'Declined' ? 'error' : 'warning',
        titleBtnText: data?.status || 'Draft',
      });
    }
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
      title: 'ID',
      subText: data?.batchId,
    },
    {
      title: 'Product Name',
      subText: data?.productItem?.name,
    },
    {
      title: 'Start Date',
      subText: data?.startDate,
    },
    {
      title: 'Finish Date',
      subText: data?.endDate,
    },
    {
      title: 'Information',
      subText: data?.information,
    },
  ];

  const componentData = [
    {
      label: 'Basic Info',
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
      component: ProductBatchEvents,
      props: {
        data: data,
        eventData: {
          data: data?.events,
          eventType: 'Calendar',
        },
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

  const { getApiUrl } = useOperator();
  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/productbatch/${router.query.id}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Product batch details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update product batch details');
      console.log(error);
    }
  };

  const renderModal = () => {
    switch (openModal) {
      case 'basicInfo':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <Add_productBatchEditor
              formData={{ data }}
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
        handleMainBtnClick={() => { setOpenVerifyProductBatchModal(true); }}
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
              open={openVerifyProductBatchModal}
              onClose={handleClose}
            >
              <div style={{ padding: 20 }}>
                <ValidationWorkflowView
                  domainObjectId={productBatchId}
                  domainSchemaName={'productbatch'}
                  wfId={data?.validationWorkflowId}
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
