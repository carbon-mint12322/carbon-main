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
const Add_productionsystemEditor = dynamic(
  import('~/gen/data-views/add_productionsystem/add_productionsystemEditor.rtml'),
);

import styles from '~/styles/theme/brands/styles';
import useFetch from 'hooks/useFetch';
import { ProductionSystem, PageConfig, ProductionSystemFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditProductionSystemProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: ProductionSystem;
}

function EditProductionSystem(props: EditProductionSystemProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit Production System',
    isTitlePresent: true,
    isMainBtnPresent: false,
  });
  const [submit, setSubmit] = useState<boolean>(false);

  const { isLoading, data } = useFetch<ProductionSystem>(
    `${getAPIPrefix()}/productionsystem/${router.query.id}?simple=true`,
  );

  const fieldFilter = {
    landParcel: data?.landParcel,
  };

  const handleFormSubmit = async (formData: ProductionSystemFormData) => {
    try {
      setSubmit(true);
      delete formData._id;
      const res = await axios.post(getApiUrl(`/productionsystem/${data?._id}`), {
        ...formData,
      });
      if (res) {
        openToast('success', 'ProductionSystem Saved');
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
      <TitleBarGeneric
        titleBarData={titleBarData}
      />
      <ModalCircularLoader open={submit} disableEscapeKeyDown>
        <>
          {data ? (
            <Add_productionsystemEditor
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

export default EditProductionSystem;
