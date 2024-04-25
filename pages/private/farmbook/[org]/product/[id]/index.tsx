// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { SxProps } from '@mui/material';
import { useAlert } from '~/contexts/AlertContext';
import Tabs from '~/components/lib/Navigation/Tabs';
import dynamic from 'next/dynamic';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import NestedDocument from '~/components/lib/NestedResources/NestedDocument'
import { Product, PageConfig } from '~/frontendlib/dataModel';
import Dialog from '~/components/lib/Feedback/Dialog';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import TabSubNav from '~/container/TabSubNav';
import axios from 'axios';

export { default as getServerSideProps } from '~/utils/ggsp';

interface ProductDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Product;
}

export default function ProductDetails(props: ProductDetailsProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const router = useRouter();
  const { operator, getAPIPrefix } = useOperator();
  const { openToast } = useAlert();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isMainBtnPresent: false,
    isAvatarIconPresent: false,
    titleIcon: WorkspacePremiumOutlinedIcon,
    isSearchBarPresent: false,
  });

  const API_URL = `${getAPIPrefix()}/product/${router.query.id}`;
  const { isLoading: loading, data: productData, reFetch } = useFetch<Product>(API_URL);

  const data = productData;

  const Add_productEditor = dynamic(import('~/gen/data-views/add_product/add_productEditor.rtml'));

  const handleClose = () => {
    setOpenModal(null);
  };

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      title: data?.name,
      subTitle: data?.productId + ' • ' + (data?.type ? data?.type : ''),
    });
  }, [data]);

  const labelList = [
    {
      label: `Info`,
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
      title: 'Product ID',
      subText: data?.productId,
    },
    {
      title: 'Category',
      subText: data?.category,
    },
    {
      title: 'Type',
      subText: data?.type,
    },
  ];

  const componentData = [
    {
      label: 'Basic Info',
      data: basicInfo,
      title: 'Basic Info',
      onClick: () => setOpenModal('basicInfo'),
    },
    {
      label: 'Documents',
      count: data?.documents?.length || 0,
      title: 'Documents',
      component: <NestedDocument data={data} reFetch={() => reFetch(API_URL)} childResourceUri={`documents`} modelName={`product`} />,
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

  const { getApiUrl } = useOperator();
  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/product/${router.query.id}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Product details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update product details');
      console.log(error);
    }
  };

  const renderModal = () => {
    switch (openModal) {
      case 'basicInfo':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <Add_productEditor
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
      />
      <Tabs labelList={labelList} componentList={componentList} />
      {renderModal()}{' '}
    </CircularLoader>
  );
}
