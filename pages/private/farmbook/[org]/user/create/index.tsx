import React, { useState, useEffect } from 'react';
import axios from 'axios';

import withAuth from '~/components/auth/withAuth';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import styles from '~/styles/theme/brands/styles';
import { PageConfig, UserFormData } from '~/frontendlib/dataModel';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';
import { useAlert } from '~/contexts/AlertContext';
import { useOperator } from '~/contexts/OperatorContext';
const UserEditor = dynamic(import('~/gen/data-views/add_user/add_userEditor.rtml'));

export { default as getServerSideProps } from '~/utils/ggsp';

interface CreateUserProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: any;
}

function CreateUser(props: CreateUserProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [submit, setSubmit] = useState<boolean>(false);
  const { openToast } = useAlert();
  const { changeRoute, getApiUrl } = useOperator();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Add User',
    isTitlePresent: true,
    isMainBtnPresent: false,
    isSubBtnPresent: false,
  });

  const handleOnSubmit = async (data: UserFormData) => {
    try {
      setSubmit(true);
      const res = await axios.post(getApiUrl('/user'), data);
      openToast('success', 'User saved successfully');
      changeRoute('/user/list');
    } catch (error: any) {
      openToast('error', error?.response?.data.error || error?.message || 'Something went wrong');
      return false;
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
        <UserEditor onSubmit={handleOnSubmit} />
      </ModalCircularLoader>
    </Box>
  );
}

export default withAuth(CreateUser);
