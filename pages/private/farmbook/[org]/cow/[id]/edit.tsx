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

const Add_cowEditor = dynamic(import('~/gen/data-views/add_cow/add_cowEditor.rtml'));

import styles from '~/styles/theme/brands/styles';

import { PageConfig, Cow, CowFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditCowProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Cow;
}

function EditCow(props: EditCowProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();
  const { setTitleBarData, setHandleMainBtnClick } = useTitleBar();

  const [submit, setSubmit] = useState<boolean>(false);

  const { isLoading, data } = useFetch<Cow[]>(`${getAPIPrefix()}/cow/${router.query.id}`);

  useEffect(() => {
    setTitleBarData({
      ...initialTitleBarContextValues.titleBarData,
      isTitleBarPresent: true,
      title: 'Edit Cow',
      mainBtnTitle: 'Save Cow',
      isTitlePresent: true,
      isMainBtnPresent: false,
    });
    setHandleMainBtnClick(() => { });
  }, []);

  const popFilter = {};

  const handleFormSubmit = async (formData: CowFormData) => {
    try {
      setSubmit(true);
      delete formData._id;
      const res = await axios.post(getApiUrl(`/cow/${data?.[0]?._id}`), {
        ...formData,
      });
      if (res) {
        openToast('success', 'Cow updated successfully');
        changeRoute('/cow/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Cow update failed');
    } finally {
      setSubmit(false);
    }
  };


  async function productionSystemFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/productionsystem`);

    // Filter the data array based on the productionSystemId
    const filteredData = res.data.filter((productionsystem: any) => productionsystem.landParcel === data?.[0].landParcel?.id && productionsystem.category === 'Dairy');

    return filteredData;
  }

  const formContext: any = {
    foreignObjectLoader: productionSystemFilter,
  };

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <CircularLoader value={isLoading}>
        {data ? (
          <Add_cowEditor
            formData={{
              data: data?.[0],
            }}
            onSubmit={handleFormSubmit}
            formContext={formContext}
          />
        ) : (
          <></>
        )}
      </CircularLoader>
    </Box>
  );
}

export default EditCow;
