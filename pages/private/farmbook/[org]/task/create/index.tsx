// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/createtask/ui';
// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
import React, { useState, useEffect } from 'react';

import withAuth from '~/components/auth/withAuth';
import { menuGssp } from '~/frontendlib/util';

import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import styles from '~/styles/theme/brands/styles';
import { useUser } from '~/contexts/AuthDialogContext';
import { TaskFormData, PageConfig } from '~/frontendlib/dataModel';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const TaskEditor = dynamic(import('~/gen/data-views/task/taskEditor.rtml'));
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
export { default as getServerSideProps } from '~/utils/ggsp';
import axios from 'axios';

interface CreateTaskProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: any;
}

function CreateTask(props: CreateTaskProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [submit, setSubmit] = useState<boolean>(false);
  const { changeRoute, getApiUrl } = useOperator();
  const { openToast } = useAlert();
  const { user } = useUser();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Add Task',
    isTitlePresent: true,
    isMainBtnPresent: false,
    isSubBtnPresent: false,
  });

  //_id: new ObjectId(user?.[0]?.uid)

  const assigneeFilter = {};

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      setSubmit(true);

      const res = await axios.post(getApiUrl('/task'), { ...data });
      if (res) {
        openToast('success', 'Task Saved');
        changeRoute('/task/list');
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
        case 'assignee': // this key is defined as ui:options in yaml
          return assigneeFilter;
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
        <TaskEditor onSubmit={handleFormSubmit} formContext={formContext} />
      </ModalCircularLoader>
    </Box>
  );
}

export default withAuth(CreateTask);
