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
const Add_collectiveEditor = dynamic(
  import('~/gen/data-views/add_collective/add_collectiveEditor.rtml'),
);

import styles from '~/styles/theme/brands/styles';

import { Collective, PageConfig, CollectiveFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditCollectiveProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Collective;
}

function EditCollective(props: EditCollectiveProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();

  const [submit, setSubmit] = useState<boolean>(false);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit Collective',
    mainBtnTitle: 'Submit Operator',
    isTitlePresent: true,
    isMainBtnPresent: true,
  });

  const { isLoading, data } = useFetch<Collective>(
    `${getAPIPrefix()}/collective/${router.query.id}`,
  );

  const handleFormSubmit = async (formData: CollectiveFormData) => {
    try {
      setSubmit(true);
      delete formData?._id;
      const res = await axios.post(getApiUrl(`collective/${data?.id}`), {
        ...formData,
      });
      if (res) {
        openToast('success', 'Operator updated successfully');
        changeRoute('/collective/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update operator details');
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
          <Add_collectiveEditor
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

export default EditCollective;
