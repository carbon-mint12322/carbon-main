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
const Add_processingsystemEditor = dynamic(
  import('~/gen/data-views/add_processingsystem/add_processingsystemEditor.rtml'),
);

import styles from '~/styles/theme/brands/styles';
import useFetch from 'hooks/useFetch';
import { PageConfig, ProcessingSystem, ProcessingSystemFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditProcessingSystemProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: ProcessingSystem;
}

function EditProcessingSystem(props: EditProcessingSystemProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();
  

  const [submit, setSubmit] = useState<boolean>(false);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit Processing System',
    isTitlePresent: true,
    isMainBtnPresent: false,
  });
  const { isLoading, data } = useFetch<ProcessingSystem>(
    `${getAPIPrefix()}/processingsystem/${router.query.id}`,
  );

  const fieldFilter = {
    landParcel: data?.landParcel,
  };

  const handleFormSubmit = async (formData: ProcessingSystemFormData) => {
    try {
      setSubmit(true);
      delete formData._id;
      const res = await axios.post(getApiUrl(`/processingsystem/${data?._id}`), {
        ...formData,
      });
      if (res) {
        openToast('success', 'Processing System Saved');
        changeRoute(`/processingsystem/${data?._id}`);
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Something went wrong');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'field': // this key is defined as ui:options in yaml
          return fieldFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <TitleBarGeneric
        titleBarData={titleBarData}
      />
      <ModalCircularLoader open={submit} disableEscapeKeyDown>
        <>
          {data ? (
            <Add_processingsystemEditor
              formData={{
                data: data,
              }}
              onSubmit={handleFormSubmit}
              formContext={formContext}
            />
          ) : (
            <></>
          )}
        </>
      </ModalCircularLoader>
    </Box>
  );
}

export default EditProcessingSystem;
