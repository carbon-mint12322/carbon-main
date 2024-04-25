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

const Add_aquacropEditor = dynamic(import('~/gen/data-views/add_aquacrop/add_aquacropEditor.rtml'));

import styles from '~/styles/theme/brands/styles';

import { PageConfig, AquaCrop, AquaCropFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditAquaCropProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: AquaCrop;
}

function EditAquaCrop(props: EditAquaCropProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();

  const [submit, setSubmit] = useState<boolean>(false);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit AquaCrop',
    mainBtnTitle: 'Save AquaCrop',
    isTitlePresent: true,
    isMainBtnPresent: false,
  });

  const { isLoading, data } = useFetch<AquaCrop[]>(`${getAPIPrefix()}/aquacrop/${router.query.id}`);

  const productionSystemFilter = {
    landParcel: data?.[0]?.landParcel?.id,
  };
  const popFilter = {};

  const handleFormSubmit = async (formData: AquaCropFormData) => {
    try {
      setSubmit(true);
      const res = await axios.post(getApiUrl(`/aquacrop/${data?.[0]?._id}`), {
        aquacrop: formData?.aquacrop,
      });
      if (res) {
        openToast('success', 'AquaCrop updated successfully');
        changeRoute('/aquacrop/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'AquaCrop update failed');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'productionSystem': // this key is defined as ui:options in yaml
          return productionSystemFilter;
        case 'pop': // this key is defined as ui:options in yaml
          return popFilter;
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
      <CircularLoader value={isLoading}>
        {data ? (
          <Add_aquacropEditor
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

export default EditAquaCrop;
