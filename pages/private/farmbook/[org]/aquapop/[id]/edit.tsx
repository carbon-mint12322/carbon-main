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
const Add_aquapopEditor = dynamic(import('~/gen/data-views/add_aquapop/add_aquapopEditor.rtml'));

import styles from '~/styles/theme/brands/styles';

import { AquaPOP, PageConfig, AquaPOPFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditAquaPopProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: AquaPOP;
}

function EditAquaPop({ data = {} as AquaPOP }: EditAquaPopProps) {
  const theme = useTheme();
  const { changeRoute, getApiUrl } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();

  const [submit, setSubmit] = useState<boolean>(false);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit AquaPOP',
    mainBtnTitle: 'Submit AquaPOP',
    isTitlePresent: true,
    isMainBtnPresent: false,
  });


  const handleFormSubmit = async (formData: AquaPOPFormData) => {
    try {
      setSubmit(true);
      const res = await axios.post(getApiUrl(`/aquapop/${data._id}`), {
        ...data,
        ...formData,
      });
      if (res) {
        openToast('success', 'Operator Saved');
        changeRoute('/aquapop/list');
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
          <Add_aquapopEditor
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

export default EditAquaPop;
