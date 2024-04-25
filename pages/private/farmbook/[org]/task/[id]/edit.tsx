import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { useAlert } from '~/contexts/AlertContext';

const TaskEditor = dynamic(import('~/gen/data-views/task/taskEditor.rtml'));

import styles from '~/styles/theme/brands/styles';

import { PageConfig, Task, TaskFormData } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import CircularLoader from '~/components/common/CircularLoader';

export { default as getServerSideProps } from '~/utils/ggsp';

interface EditTaskProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Task;
}

function EditTask(props: EditTaskProps) {
  const theme = useTheme();
  const router = useRouter();
  const { changeRoute, getApiUrl, getAPIPrefix } = useOperator();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { openToast } = useAlert();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Edit Task',
    isTitlePresent: true,
    isMainBtnPresent: false,
  });
  const [submit, setSubmit] = useState<boolean>(false);

  const { isLoading, data } = useFetch<Task[]>(`${getAPIPrefix()}/task/${router.query.id}`);

  const assigneeFilter = {};
  const assignorFilter = {};

  const handleFormSubmit = async (formData: TaskFormData) => {
    try {
      setSubmit(true);
      delete formData.assigneeUser;
      delete formData.assignorUser;
      delete formData.taskId;
      const res = await axios.post(getApiUrl(`/task/${data?.[0]?._id}`), { formData });
      if (res) {
        openToast('success', 'Task updated successfully');
        changeRoute('/task/list');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Task update failed');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'assignee': // this key is defined as ui:options in yaml
          return assigneeFilter;
        case 'assignor': // this key is defined as ui:options in yaml
          return assignorFilter;
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
          <TaskEditor
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

export default EditTask;
