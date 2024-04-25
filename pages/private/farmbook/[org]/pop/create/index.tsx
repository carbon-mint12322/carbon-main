import React, { useState, useEffect, Dispatch, SetStateAction, ChangeEvent } from 'react';

import withAuth from '~/components/auth/withAuth';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import styles from '~/styles/theme/brands/styles';
import { PageConfig } from '~/frontendlib/dataModel';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';
import POPEditor from '~/gen/data-views/add_pop/add_popEditor.rtml';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import axios from 'axios';
import { read, utils } from 'xlsx';
import { getPopFromExcel } from '~/frontendlib/utils/getPopFromExcel';
import { PopFromExcel } from '~/backendlib/pop/types';
import { useRouter } from 'next/router';
import useFetch from 'hooks/useFetch';
import { omit } from 'lodash';
import { transformErrors } from '~/frontendlib/transformErrors/pop';

export { default as getServerSideProps } from '~/utils/ggsp';

interface CreatePOPProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: any;
}

function CreatePOP(props: CreatePOPProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [submit, setSubmit] = useState<boolean>(false);
  const { changeRoute, getApiUrl } = useOperator();
  const { openToast } = useAlert();
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const router = useRouter();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Add POP',
    isTitlePresent: true,
    mainBtnTitle: 'Import From Template',
    subBtnTitle: 'Save Draft',
    subBtnColor: 'secondary',
    isMainBtnPresent: true,
    isSubBtnPresent: false,
  });

  const [formDataFromExcel, setFormDataFromExcel] = useState<PopFromExcel>();

  const { isLoading, data } = useFetch<PopFromExcel>(
    getApiUrl(`/pop/${router.query.duplicate_from_id}`),
  );

  useEffect(() => {
    if (data) {
      // Removing POP name to make user manually enter it and then save it
      const { name, description, recommendedBy, ...rest } = data
      const omittedField = ['_id', 'createdAt', 'createdBy'];
      const restFields = omit(rest, omittedField);
      setFormDataFromExcel(restFields as PopFromExcel);
    }
  }, [data]);


  const handleOnSubmitAttempt = () => {
    setSubmit(true);
  };

  const handleOnSettled = () => {
    setSubmit(false);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setSubmit(true);
      delete data?.verificationDetails;
      const res = await axios.post(getApiUrl('/pop'), { ...data, status: 'Draft' });
      if (res) {
        openToast('success', 'POP Saved');
        changeRoute('/pop/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Something went wrong');
    } finally {
      setSubmit(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleMainBtnClick={() => { setShowUpload(true) }}
      />
      <ReadPOPFromExcel
        showUpload={showUpload}
        setShowUpload={setShowUpload}
        onExcelDataFetched={setFormDataFromExcel}
      />

      <ModalCircularLoader open={submit} disableEscapeKeyDown>
        <>
          {formDataFromExcel && (
            <POPEditor onSubmit={handleFormSubmit} formData={{ data: formDataFromExcel }} transformErrors={transformErrors} />
          )}
          {!formDataFromExcel && <POPEditor onSubmit={handleFormSubmit} transformErrors={transformErrors} />}
        </>
      </ModalCircularLoader>
    </Box>
  );
}

/** */
export function ReadPOPFromExcel({
  showUpload,
  setShowUpload,
  onExcelDataFetched,
  isExternal
}: {
  showUpload: boolean;
  setShowUpload: Dispatch<SetStateAction<boolean>>;
  onExcelDataFetched: Dispatch<SetStateAction<PopFromExcel | undefined>> | any;
  isExternal?: boolean
}) {
  const { openToast } = useAlert();

  const readFile = (
    file: any,
    format: 'string' | 'arrayBuffer' | 'base64' = 'string',
  ): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function fileReadCompleted() {
        // when the reader is done, the content is in reader.result.
        resolve(reader.result);
      };

      if (format === 'base64') return reader.readAsDataURL(file);
      if (format === 'arrayBuffer') return reader.readAsArrayBuffer(file);

      reader.readAsText(file);
    });
  };

  const uploadHandler = async (event: any) => {
    try {
      const files = event?.target?.files;

      if (files.length === 0) {
        console.log('No file selected.');
        return;
      }

      const file = files[0];

      const content = (await readFile(file, 'arrayBuffer')) as ArrayBuffer;

      const wb = read(content, { cellDates: true });
      const firstSheet = wb.Sheets[Object.keys(wb.Sheets)[0]];
      const json = utils.sheet_to_json(firstSheet)
      if (isExternal) { return onExcelDataFetched(json) }
      const pop = getPopFromExcel(json);

      if (pop) onExcelDataFetched(pop);
    } catch (e: any) {
      const errorMessage = `An error occurred: ${e.message}`;
      openToast('error', errorMessage);
    }
  };

  // Toggle upload file dialog
  useEffect(() => {
    // if show upload, then show dialog
    if (showUpload) {
      document.getElementById('fileUpload')?.click();
      setShowUpload(false);
    }
  }, [showUpload]);

  return <input type='file' id='fileUpload' style={{ display: 'none' }} onChange={uploadHandler} />;
}

/** */
// function get

export default withAuth(CreatePOP);
