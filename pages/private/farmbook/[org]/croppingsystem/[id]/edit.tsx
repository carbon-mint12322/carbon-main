import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useTitleBar } from '~/contexts/TitleBar/TitleBarProvider';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import { useAlert } from '~/contexts/AlertContext';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_croppingsystemEditor = dynamic(
  import('~/gen/data-views/add_croppingsystem/add_croppingsystemEditor.rtml'),
);

import styles from '~/styles/theme/brands/styles';
import useFetch from 'hooks/useFetch';
import { CroppingSystem, PageConfig, CroppingSystemFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditCroppingSystemProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: CroppingSystem;
}

function EditCroppingSystem(props: EditCroppingSystemProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();
  const { setTitleBarData, setHandleMainBtnClick } = useTitleBar();

  const [submit, setSubmit] = useState<boolean>(false);

  const { isLoading, data } = useFetch<CroppingSystem>(
    `${getAPIPrefix()}/croppingsystem/${router.query.id}`,
  );

  useEffect(() => {
    setTitleBarData({
      ...initialTitleBarContextValues.titleBarData,
      isTitleBarPresent: true,
      title: 'Edit Cropping System',
      mainBtnTitle: 'Submit Cropping System',
      isTitlePresent: true,
      isMainBtnPresent: false,
    });
    setHandleMainBtnClick(() => { });
  }, []);

  const fieldFilter = {
    landParcel: data?.landParcel,
  };

  const handleFormSubmit = async (formData: CroppingSystemFormData) => {
    try {
      setSubmit(true);
      delete formData._id;
      const res = await axios.post(getApiUrl(`/croppingsystem/${data?._id}`), {
        ...formData,
      });
      if (res) {
        openToast('success', 'CroppingSystem Saved');
        changeRoute(`/landparcel/${data?.landParcel}`);
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
      <ModalCircularLoader open={submit} disableEscapeKeyDown>
        <>
          {data ? (
            <Add_croppingsystemEditor
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

export default EditCroppingSystem;
