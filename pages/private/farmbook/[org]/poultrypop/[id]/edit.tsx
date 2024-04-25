import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { useAlert } from '~/contexts/AlertContext';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_poultrypopEditor = dynamic(
  import('~/gen/data-views/add_poultrypop/add_poultrypopEditor.rtml'),
);

import styles from '~/styles/theme/brands/styles';

import { PoultryPOP, PageConfig, PoultryPOPFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditPoultryPopProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: PoultryPOP;
}

function EditPoultryPop(props: EditPoultryPopProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();

  const [submit, setSubmit] = useState<boolean>(false);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit PoultryPOP',
    isTitlePresent: true,
    isMainBtnPresent: false,
  });
  const { isLoading, data } = useFetch<PoultryPOP>(
    `${getAPIPrefix()}/poultrypop/${router.query.id}`,
  );

  const handleFormSubmit = async (formData: PoultryPOPFormData) => {
    try {
      setSubmit(true);
      const res = await axios.post(getApiUrl(`/poultrypop/${router.query.id}`), {
        ...data,
        ...formData,
      });
      if (res) {
        openToast('success', 'Poultry POP Saved');
        changeRoute('/poultrypop/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Something went wrong');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <TitleBarGeneric
        titleBarData={titleBarData}
      />
      <ModalCircularLoader open={submit} disableEscapeKeyDown>
        {data ? (
          <Add_poultrypopEditor
            formData={{
              data: data,
            }}
            onSubmit={handleFormSubmit}
          />
        ) : (
          <></>
        )}
      </ModalCircularLoader>
    </Box>
  );
}

export default EditPoultryPop;
