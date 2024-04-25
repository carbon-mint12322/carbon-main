import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import TitleBarGeneric from '~/components/TitleBarGeneric';

import useFetch from 'hooks/useFetch';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_processorEditor = dynamic(
  import('~/gen/data-views/add_processor/add_processorEditor.rtml'),
);

import styles from '~/styles/theme/brands/styles';
import { useAlert } from '~/contexts/AlertContext';

import { Processor, PageConfig, ProcessorFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditProcessorProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Processor;
}

function EditProcessor(props: EditProcessorProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix, operator } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit Processor',
    isTitlePresent: true,
    isMainBtnPresent: false,
  });
  const [submit, setSubmit] = useState<boolean>(false);

  const { isLoading, data } = useFetch<Processor[]>(`${getAPIPrefix()}/farmer/${router.query.id}`);

  const handleFormSubmit = async (formData: ProcessorFormData) => {
    try {
      setSubmit(true);
      delete formData._id;
      const res = await axios.post(getApiUrl(`/farmer/${router.query.id}`), {
        ...formData,
      });
      if (res) {
        openToast('success', 'Processor Saved');
        changeRoute('/processor/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Something went wrong');
    } finally {
      setSubmit(false);
    }
  };

  async function defaultListFilter(options: any) {
    if (options?.uiOptions.filterKey === 'subgroup') {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/collective/${operator?._id.toString()}`);
      return res.data?.subGroups;
    } else {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `${options.schemaId}`);
      return res.data;
    }
  }

  const formContext: any = {
    foreignObjectLoader: defaultListFilter,
  };

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <TitleBarGeneric
        titleBarData={titleBarData}
      />
      <ModalCircularLoader open={submit} disableEscapeKeyDown>
        {data ? (
          <Add_processorEditor
            formData={{
              data: data,
            }}
            onSubmit={handleFormSubmit}
            formContext={formContext}
          />
        ) : (
          <></>
        )}
      </ModalCircularLoader>
    </Box>
  );
}

export default EditProcessor;
