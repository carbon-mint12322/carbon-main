import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import useFetch from 'hooks/useFetch';
import { useAlert } from '~/contexts/AlertContext';

import { useTitleBar } from '~/contexts/TitleBar/TitleBarProvider';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import CircularLoader from '~/components/common/CircularLoader';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Landparcel_fieldsEditor = dynamic(
  import('~/gen/data-views/landparcel_editfield/landparcel_editfieldEditor.rtml'),
);

import styles from '~/styles/theme/brands/styles';

import { Field, PageConfig, FieldFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import {
  coordinateStringToCoordinateObject,
  polygonToMapCenter,
} from '~/utils/coordinatesFormatter';
import { calculatePolygonArea } from '~/utils/mapUtils';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditFieldProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Field;
}

function EditField(props: EditFieldProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();
  const { setTitleBarData, setHandleMainBtnClick } = useTitleBar();

  const [submit, setSubmit] = useState<boolean>(false);

  const { isLoading, data } = useFetch<Field>(`${getAPIPrefix()}/field/${router.query.id}`);

  useEffect(() => {
    setTitleBarData({
      ...initialTitleBarContextValues.titleBarData,
      isTitleBarPresent: true,
      title: 'Edit Field',
      mainBtnTitle: 'Submit Field',
      isTitlePresent: true,
      isMainBtnPresent: false,
    });
    setHandleMainBtnClick(() => { });
  }, []);

  const handleFormSubmit = async (formData: FieldFormData) => {
    try {
      setSubmit(true);
      delete formData?._id;
      let paths = coordinateStringToCoordinateObject(formData?.map);
      let acres = calculatePolygonArea({ paths: paths });
      let coordinates = polygonToMapCenter(paths[0]);

      const res = await axios.post(getApiUrl(`/field/${data?._id}`), {
        map: formData?.map,
        areaInAcres: formData?.areaInAcres,
        name: formData?.name,
        calculatedAreaInAcres: acres?.toFixed(2),
        location: coordinates,
      });
      if (res) {
        openToast('success', 'Field updated successfully');
        changeRoute('/field/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Field update failed');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <CircularLoader value={isLoading}>
        {data ? <Landparcel_fieldsEditor formData={{ data }} onSubmit={handleFormSubmit} /> : <></>}
      </CircularLoader>
    </Box>
  );
}

export default EditField;
