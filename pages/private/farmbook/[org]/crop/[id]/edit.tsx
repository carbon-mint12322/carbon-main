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

const CropEditor = dynamic(import('~/gen/data-views/add_crop/add_cropEditor.rtml'));

import styles from '~/styles/theme/brands/styles';

import { PageConfig, Crop, CropFormData, LandParcel } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditCropProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Crop;
}

function EditCrop(props: EditCropProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();

  const [submit, setSubmit] = useState<boolean>(false);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit Crop',
    mainBtnTitle: 'Save Crop',
    isTitlePresent: true,
    isMainBtnPresent: false,
  });
  const { isLoading, data } = useFetch<Crop[]>(`${getAPIPrefix()}/crop/${router.query.id}`);

  const csFilter = {
    landParcel: data?.[0]?.landParcel.id,
  };
  const plotFilter = {
    landParcel: data?.[0]?.landParcel.id,
  };
  const popFilter = {};
  const masterCropFilter = {};

  const handleFormSubmit = async (formData: CropFormData) => {
    try {
      setSubmit(true);
      delete formData._id;
      const res = await axios.post(getApiUrl(`/crop/${data?.[0]._id}`), {
        ...formData,
      });
      if (res) {
        openToast('success', 'Crop updated successfully');
        changeRoute('/crop/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Crop update failed');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'croppingSystem': // this key is defined as ui:options in yaml
          return csFilter;
        case 'pop': // this key is defined as ui:options in yaml
          return popFilter;
        case 'mastercrop': // this key is defined as ui:options in yaml
          return masterCropFilter;
        case 'plot': // this key is defined as ui:options in yaml
          return plotFilter;
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
          <CropEditor
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

export default EditCrop;
