import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { useAlert } from '~/contexts/AlertContext';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_popEditor = dynamic(import('~/gen/data-views/add_pop/add_popEditor.rtml'));

import styles from '~/styles/theme/brands/styles';

import { POP, PageConfig, POPFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import { transformErrors } from '~/frontendlib/transformErrors/pop';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditPopProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: POP;
}

function EditPop(props: EditPopProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();

  const [submit, setSubmit] = useState<boolean>(false);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit POP',
    isTitlePresent: true,
    isMainBtnPresent: false,
  });
  const { isLoading, data } = useFetch<POP>(`${getAPIPrefix()}/pop/${router.query.id}`);

  const handleFormSubmit = async (formData: POPFormData) => {
    try {
      setSubmit(true);
      delete formData._id;
      const res = await axios.post(getApiUrl(`/pop/${data?._id}`), {
        ...formData,
      });
      if (res) {
        openToast('success', 'POP Saved');
        changeRoute('/pop/list');
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
        {data ? <Add_popEditor formData={{ data }} onSubmit={handleFormSubmit} transformErrors={transformErrors} /> : <></>}
      </ModalCircularLoader>
    </Box>
  );
}

export default EditPop;
