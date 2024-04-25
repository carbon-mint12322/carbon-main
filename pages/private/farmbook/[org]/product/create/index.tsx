import React, { useState, useEffect } from 'react';

import withAuth from '~/components/auth/withAuth';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import styles from '~/styles/theme/brands/styles';
import { PageConfig } from '~/frontendlib/dataModel';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
const ProductEditor = dynamic(import('~/gen/data-views/add_product/add_productEditor.rtml'));

export { default as getServerSideProps } from '~/utils/ggsp';

interface CreateProductProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: any;
}

function CreateProduct(props: CreateProductProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [submit, setSubmit] = useState<boolean>(false);
  const { changeRoute, getApiUrl } = useOperator();
  const { openToast } = useAlert();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Add Product',
    isTitlePresent: true,
    isMainBtnPresent: false,
    isSubBtnPresent: false,
  });

  const handleFormSubmit = async (data: any) => {
    try {
      setSubmit(true);
      delete data?.verificationDetails;
      const res = await axios.post(getApiUrl('/product'), { ...data, status: 'Draft' });
      if (res) {
        openToast('success', 'Product Saved');
        changeRoute('/product/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Something went wrong');
    } finally {
      setSubmit(false);
    }
  };

  const handleOnSettled = () => {
    setSubmit(false);
  };

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <TitleBarGeneric
        titleBarData={titleBarData}
      /> 
      <ModalCircularLoader open={submit} disableEscapeKeyDown>
        <ProductEditor onSubmit={handleFormSubmit} />
      </ModalCircularLoader>
    </Box>
  );
}

export default withAuth(CreateProduct);
