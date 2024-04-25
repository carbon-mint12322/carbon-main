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

const Add_goatEditor = dynamic(import('~/gen/data-views/add_goat/add_goatEditor.rtml'));

import styles from '~/styles/theme/brands/styles';

import { PageConfig, Goat, GoatFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditGoatProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Goat;
}

function EditGoat(props: EditGoatProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();
  const { setTitleBarData, setHandleMainBtnClick } = useTitleBar();

  const [submit, setSubmit] = useState<boolean>(false);

  const { isLoading, data } = useFetch<Goat[]>(`${getAPIPrefix()}/goat/${router.query.id}`);

  useEffect(() => {
    setTitleBarData({
      ...initialTitleBarContextValues.titleBarData,
      isTitleBarPresent: true,
      title: 'Edit Goat',
      mainBtnTitle: 'Save Goat',
      isTitlePresent: true,
      isMainBtnPresent: false,
    });
    setHandleMainBtnClick(() => { });
  }, []);

  const popFilter = {};

  const handleFormSubmit = async (formData: GoatFormData) => {
    try {
      setSubmit(true);
      delete formData._id;
      const res = await axios.post(getApiUrl(`/goat/${data?.[0]?._id}`), {
        ...formData,
      });
      if (res) {
        openToast('success', 'Goat updated successfully');
        changeRoute('/goat/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Goat update failed');
    } finally {
      setSubmit(false);
    }
  };

  async function productionSystemFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/productionsystem`);

    // Filter the data array based on the productionSystemId
    const filteredData = res.data.filter((productionsystem: any) => productionsystem.landParcel === data?.[0].landParcel?.id && productionsystem.category === 'Goats');

    return filteredData;
  }

  const formContext: any = {
    foreignObjectLoader: productionSystemFilter,
  };

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <CircularLoader value={isLoading}>
        {data ? (
          <Add_goatEditor
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

export default EditGoat;
