import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { useAlert } from '~/contexts/AlertContext';

const ProductBatchEditor = dynamic(
  import('~/gen/data-views/add_productBatch/add_productBatchEditor.rtml'),
);

import styles from '~/styles/theme/brands/styles';

import {
  PageConfig,
  ProductBatch,
  ProductBatchFormData,
  LandParcel,
} from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditProductBatchProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: ProductBatch;
}

function EditProductBatch(props: EditProductBatchProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit Product Batch',
    isTitlePresent: true,
    isMainBtnPresent: false,
  });
  const [submit, setSubmit] = useState<boolean>(false);

  const { isLoading, data } = useFetch<ProductBatch>(
    `${getAPIPrefix()}/productbatch/${router.query.id}`,
  );

  const handleFormSubmit = async (formData: ProductBatchFormData) => {
    try {
      setSubmit(true);
      delete formData._id;
      const res = await axios.post(getApiUrl(`/productbatch/${data?._id}`), {
        ...formData,
      });
      if (res) {
        openToast('success', 'Product Batch updated successfully');
        changeRoute('/productbatch/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Product Batch update failed');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <TitleBarGeneric
        titleBarData={titleBarData}
      />
      <CircularLoader value={isLoading}>
        {data ? (
          <ProductBatchEditor
            formData={{
              data,
            }}
            onSubmit={handleFormSubmit}
          />
        ) : (
          <></>
        )}
      </CircularLoader>
    </Box>
  );
}

export default EditProductBatch;
