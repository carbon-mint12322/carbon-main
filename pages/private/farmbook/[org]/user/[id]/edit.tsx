import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';
import useFetch from 'hooks/useFetch';

import Box from '@mui/material/Box';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { useAlert } from '~/contexts/AlertContext';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const UserEditor = dynamic(import('~/gen/data-views/add_user/add_userEditor.rtml'));

import styles from '~/styles/theme/brands/styles';

import CircularLoader from '~/components/common/CircularLoader';

import { User, PageConfig, UserFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditUserProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: User;
}

function EditUser(props: EditUserProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();

  const { isLoading, data } = useFetch<User>(`${getAPIPrefix()}/user/${router.query.id}`);

  const [submit, setSubmit] = useState<boolean>(false);
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit User',
    isTitlePresent: false,
    isMainBtnPresent: false,
  });

  const handleFormSubmit = async (formData: UserFormData) => {
    try {
      setSubmit(true);
      delete formData._id;
      delete formData?.agentItem;
      delete formData?.displayRoles;

      const res = await axios.post(getApiUrl(`/user/${router.query.id}`), {
        ...formData,
      });
      if (res) {
        openToast('success', 'User Saved');
        changeRoute('/user/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Something went wrong');
    } finally {
      setSubmit(false);
    }
  };

  const reverseUserRoleParser = (data: any) => {
    if (data) {
      return {
        ...data,
        roles: data.rolesCopy,
      };
    }
  };

  const parsedData = reverseUserRoleParser(data);

  return (
    <Box sx={[styles.formFields, { m: matchDownSM ? '0' : '0 12rem' }]}>
      <TitleBarGeneric
        titleBarData={titleBarData}
      />
      <CircularLoader value={isLoading}>
        <ModalCircularLoader open={submit} disableEscapeKeyDown>
          <UserEditor formData={{ data: parsedData }} onSubmit={handleFormSubmit} />
        </ModalCircularLoader>
      </CircularLoader>
    </Box>
  );
}

export default EditUser;
