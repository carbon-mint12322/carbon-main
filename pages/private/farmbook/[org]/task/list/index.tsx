// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
import React, { useMemo, useState } from 'react';

import { Box, Button, Grid, IconButton, Paper, Typography } from '@mui/material';
import { GridColDef, GridRowParams, GridValueGetterParams } from '@mui/x-data-grid';
import ListActionModal from '~/components/lib/ListActionModal';
import dynamic from 'next/dynamic';

import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import CircularLoader from '~/components/common/CircularLoader';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import TaskEditForm from '~/container/task/edit';

import globalStyles from '~/styles/theme/brands/styles';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { useOperator } from '~/contexts/OperatorContext';
import axios from 'axios';
export { default as getServerSideProps } from '~/utils/ggsp';
import ListAction from '~/components/lib/ListAction';

import useFetch from 'hooks/useFetch';

import CustomFooter from '~/components/CustomFooter';
import { filterDataByCustomKeys } from '~/components/lib/FilterDataByCustomKeys';

const styles = {
  cropAndLandParcelCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
  cropAndLandParcelSubtitle: { color: 'text.disabled', wordWrap: 'break-word' },
  renderActionCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
  cropChip: {
    background: '#F1F1F1',
    color: 'textPrimary',
  },
  cropChipIcon: {
    color: 'iconColor.default',
  },
};

export default function Task() {
  const { changeRoute, getAPIPrefix, agentData } = useOperator();
  const [showAll, setShowAll] = useState(true);

  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Tasks',
    mainBtnTitle: 'Add Task',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: true,
    isSubBtnPresent: false,
  });
  const API_URL = getAPIPrefix() + '/task';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);

  const TaskEditor = dynamic(import('~/gen/data-views/task/taskEditor.rtml'));

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data
        ? showAll
          ? data?.length
          : data?.filter((item: any) => item.assigneeUser?._id.toString() === agentData?.userId)
            .length
        : 0
        } tasks in total`,
    });
  }, [data, showAll]);

  const handleRowClick = (params: any) => {
    changeRoute(`/task/${params?.row?.id}`);
  };

  const handleActivation = () => {
    reFetch(API_URL);
  };

  const handleSearch = (value: any) => {
    setSearchValue(value);
  };

  const searchData = useMemo(() => {
    const filterActive = (data: any[]) => data?.filter((item: any) => true);
    const filterSelfTasks = (data: any[]) =>
      data?.filter((item: any) =>
        !showAll ? item.assigneeUser?._id.toString() === agentData?.userId : true,
      );

    if (searchValue?.length > 0) {
      return filterActive(
        filterSelfTasks(
          filterDataByCustomKeys(data, searchValue, [
            'name',
            'desc',
            'assigneeUser.personalDetails.firstName',
            'assigneeUser.personalDetails.lastName',
            'assignorUser.personalDetails.firstName',
            'assignorUser.personalDetails.lastName',
          ]),
        ),
      );
    }
    return filterActive(filterSelfTasks(data));
  }, [searchValue, data, showAll]);

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          canActivate={false}
          canEdit={data?.row?.status == 'Completed' ? false : true}
          canDelete={false}
          isActive={data.row.active}
          id={data.row.id}
          data={data.row}
          reFetch={reFetch}
          schema={'task'}
          Editor={TaskEditForm}
        />
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Task name',
      minWidth: 250,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row?.name}`,
    },
    {
      field: 'desc',
      headerName: 'Description',
      minWidth: 150,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row?.desc}`,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      minWidth: 150,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.priority}`,
    },
    {
      field: 'assignee',
      headerName: 'Assignee',
      minWidth: 50,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.assigneeUser?.personalDetails?.firstName} ${params.row.assigneeUser?.personalDetails?.lastName
          ? params.row.assigneeUser?.personalDetails?.lastName
          : ''
        }`,
    },
    {
      field: 'assignor',
      headerName: 'Assignor',
      minWidth: 50,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.assignorUser?.personalDetails?.firstName} ${params.row.assignorUser?.personalDetails?.lastName
          ? params.row.assignorUser.personalDetails?.lastName
          : ''
        }`,
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      sortable: false,
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.dueDate}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.status}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 200,
      flex: 1,
      renderCell: renderActionCell,
      valueGetter: (params: GridValueGetterParams) => `${params.row.status}`,
    },
  ];

  return (
    <>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleSearch={handleSearch}
        handleMainBtnClick={() => {
          changeRoute('/task/create');
        }}
      />
      <Paper elevation={0}>
        <CircularLoader value={loading}>
          <Box style={globalStyles.dataGridLayer}>
            <DataGrid
              columns={columns}
              rows={searchData || []}
              disableColumnSelector={false}
              isRowSelectable={(params: GridRowParams) => false}
              rowHeight={64}
              disableSelectionOnClick
              sx={globalStyles.datagridSx}
              onRowClick={handleRowClick}
              components={{
                Footer: CustomFooter,
              }}
              componentsProps={{
                footer: {
                  taskFilter: !showAll,
                  showTaskSwitch: true,
                  onTaskFilterSwitchClick: () => setShowAll(!showAll),
                },
              }}
            />
          </Box>
        </CircularLoader>
      </Paper>
    </>
  );
}
