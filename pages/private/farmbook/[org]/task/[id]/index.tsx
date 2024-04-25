// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmerDetails/ui'
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { SxProps } from '@mui/material';
import { useAlert } from '~/contexts/AlertContext';
import Tabs from '~/components/lib/Navigation/Tabs';
import dynamic from 'next/dynamic';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';
import EntityHistoryCard from '~/components/common/EntityHistoryCard';
import { Task, PageConfig } from '~/frontendlib/dataModel';
import Dialog from '~/components/lib/Feedback/Dialog';
import useFetch from 'hooks/useFetch';
import { useOperator } from '~/contexts/OperatorContext';
import CircularLoader from '~/components/common/CircularLoader';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import TabSubNav from '~/container/TabSubNav';
import axios from 'axios';

export { default as getServerSideProps } from '~/utils/ggsp';

interface TaskDetailsProps {
  sx: SxProps;
  pageConfig: PageConfig;
  data: Task;
}

export default function TaskDetails(props: TaskDetailsProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const router = useRouter();
  const { operator, getAPIPrefix } = useOperator();
  const { openToast } = useAlert();
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    isTitlePresent: true,
    isSubTitlePresent: true,
    isMainBtnPresent: false,
    isAvatarIconPresent: false,
    titleIcon: WorkspacePremiumOutlinedIcon,
    isSearchBarPresent: false,
  });

  const API_URL = `${getAPIPrefix()}/task/${router.query.id}`;
  const { isLoading: loading, data: taskData, reFetch } = useFetch<Task>(API_URL);

  const data = taskData;

  const TaskEditor = dynamic(import('~/gen/data-views/task/taskEditor.rtml'));

  const handleClose = () => {
    setOpenModal(null);
  };

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      title: data?.name,
      subTitle:
        data?.assigneeUser.personalDetails.firstName +
        ' ' +
        data?.assigneeUser.personalDetails.lastName,
    });
  }, [data]);

  const labelList = [
    {
      label: `Task Details`,
    },
    {
      label: 'History',
    },
  ];

  const basicInfo = [
    {
      title: 'Task Name',
      subText: data?.name,
    },
    {
      title: 'Task description',
      subText: data?.desc,
    },
    {
      title: 'Status',
      subText: data?.status,
    },
    {
      title: 'Attachments',
      subText: 'Attachments',
      url: data?.documents,
    },
    {
      title: 'Assignee',
      subText:
        data?.assigneeUser?.personalDetails?.firstName +
        ' ' +
        data?.assigneeUser?.personalDetails?.lastName,
    },
    {
      title: 'Assignor',
      subText:
        data?.assignorUser?.personalDetails?.firstName +
        ' ' +
        data?.assignorUser?.personalDetails?.lastName,
    },
  ];

  const componentData = [
    {
      label: 'Details',
      data: basicInfo,
      title: 'Task Details',
      onClick: () => setOpenModal('basicInfo'),
    },
  ];

  const componentList = [
    {
      component: TabSubNav,
      props: { data: componentData },
    },
    {
      component: EntityHistoryCard,
      props: {
        data: {
          history: data?.histories,
          collective: operator,
        },
      },
    },
  ];

  const { getApiUrl } = useOperator();
  const handleFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/task/${router.query.id}`);
      delete formData._id;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Task details updated');
          setOpenModal(null);
        });
      reFetch(API_URL);
    } catch (error: any) {
      openToast('error', 'Failed to update task details');
      console.log(error);
    }
  };

  const renderModal = () => {
    switch (openModal) {
      case 'basicInfo':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <TaskEditor
              formData={{
                data: data,
              }}
              onSubmit={handleFormSubmit}
              onCancelBtnClick={handleClose}
            />
          </Dialog>
        );

      default:
        return null;
    }
  };

  return (
    <CircularLoader value={loading}>
      <TitleBarGeneric
        titleBarData={titleBarData}
      />
      <Tabs labelList={labelList} componentList={componentList} />
      {renderModal()}{' '}
    </CircularLoader>
  );
}
