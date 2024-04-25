// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmersList/ui'
import axios from 'axios';

import React, { useMemo, useState } from 'react';

import { Paper, Box, Grid } from '@mui/material';
import {
  GridRenderCellParams,
  GridColDef,
  GridValueGetterParams,
  GridRowParams,
  GridCellEditCommitParams,
  GridCellModes,
  GridCellParams,
  GridCellModesModel,
} from '@mui/x-data-grid';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import ListAction from '~/components/lib/ListAction';
import { SxProps, Typography } from '@mui/material';
import If from '~/components/lib/If';
import Image from 'next/image';

import { filterData } from '~/components/lib/FilterData';

import withAuth from '~/components/auth/withAuth';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import globalStyles from '~/styles/theme/brands/styles';
import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import CropAndLandParcelCell from '~/components/CropAndLandParcelCell';

import useFetch from 'hooks/useFetch';

import CustomFooter from '~/components/CustomFooter';
import { isoToLocal } from '~/utils/dateFormatter';

export { default as getServerSideProps } from '~/utils/ggsp';

function NotificationsList() {
  const { changeRoute, getAPIPrefix, getApiUrl } = useOperator();
  const [showInactive, setShowInactive] = useState(false);
  const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});
  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Notifications',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: false,
  });
  const API_URL = getAPIPrefix() + '/notification';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data?.length || 0} notifications in total`,
    });
  }, [data]);

  const handleRowClick = async (params: GridRowParams) => {
    try {
      const apiUrl = getApiUrl(`/notification/${params?.row?.id}`);
      await axios.post(apiUrl, {
        status: 'Read',
      });
    } catch (error) {
      console.log(error);
    }
    changeRoute(`${params?.row?.link}`);
  };

  const handleActivation = () => {
    reFetch(API_URL);
  };

  const handleSearch = (value: any) => {
    setSearchValue(value);
  };

  function renderActionCell(params: GridRenderCellParams) {
    return (
      <ListAction
        canActivate={data?.row?.status == 'Draft' ? true : false}
        canEdit={data?.row?.status == 'Draft' ? true : false}
        canDelete={data?.row?.status == 'Draft' ? true : false}
        isActive={params?.row?.active}
        id={params?.row?.id}
        schema={'notification'}
        onActivationClick={handleActivation}
      />
    );
  }
  const styles = {
    cropAndLandParcelCell: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '14px',
      padding: '8px 0px',
    },
    cropAndLandParcelSubtitle: { color: 'text.disabled', wordWrap: 'break-word' },
  };

  const renderCropAndLandParcelCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.cropAndLandParcelCell}>
        <Box component={'div'}>
          <If value={data?.row?.message}>
            <Typography variant='subtitle1' sx={styles.cropAndLandParcelCell}>
              {data?.row?.message}
            </Typography>
          </If>
          <If value={data?.row?.landParcel}>
            <Typography variant='subtitle2' sx={styles.cropAndLandParcelSubtitle}>
              {data?.row?.landParcel?.name}
            </Typography>
          </If>
          <If value={data?.row?.crop}>
            <Typography variant='subtitle2' sx={styles.cropAndLandParcelSubtitle}>
              {data?.row?.crop?.landParcel?.name}
              {` : `}
              {data?.row?.crop?.name}{` (`}{data?.row?.crop?.fbId}{`)`}
            </Typography>
          </If>
          <If value={data?.row?.productionSystem?.[0]}>
            <Typography variant='subtitle2' sx={styles.cropAndLandParcelSubtitle}>
              {data?.row?.productionSystem?.[0]?.landparcel?.[0]?.name}
              {` : `}
              {data?.row?.productionSystem?.[0]?.name} ({data?.row?.productionSystem?.[0]?.category}
              )
            </Typography>
          </If>
          <If value={data?.row?.processingSystem?.[0]}>
            <Typography variant='subtitle2' sx={styles.cropAndLandParcelSubtitle}>
              {data?.row?.processingSystem?.[0]?.landparcel?.[0]?.name}
              {` : `}
              {data?.row?.processingSystem?.[0]?.name} ({data?.row?.processingSystem?.[0]?.category}
              )
            </Typography>
          </If>
        </Box>
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'message',
      headerName: 'Message',
      minWidth: 500,
      flex: 1,

      renderCell: renderCropAndLandParcelCell,
      hideable: false,
    },
    {
      field: 'createdAt',
      headerName: 'Date & Time',
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => isoToLocal(params.row.createdAt),
      type: 'dateTime',
    },
    {
      field: 'category',
      headerName: 'Category',
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => params.row.category,
    },
    {
      field: 'sender',
      headerName: 'Sender',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params?.row?.sender?.name +
        (params?.row?.sender?.role ? ' (' + params?.row?.sender?.role + ')' : ''),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      renderCell: (params) => (
        <Grid container alignItems='center'>
          {params.value} <ArrowDropDownIcon />
        </Grid>
      ),
      editable: true,
      type: 'singleSelect',
      valueOptions: [
        { value: 'Unread', label: 'Unread' },
        { value: 'Read', label: 'Read' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Closed', label: 'Closed' },
        { value: 'Archived', label: 'Archived' },
      ],
    },
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   sortable: false,
    //   width: 100,
    //   flex: 1,
    //   renderCell: renderActionCell,
    // },
  ];

  const searchData = useMemo(() => {
    const filterActive = (data: any[]) =>
      data?.filter((item: any) => (showInactive ? !item.active : item.active));

    if (searchValue?.length > 0) {
      return filterActive(filterData(data, searchValue));
    }
    return filterActive(data);
  }, [searchValue, data, showInactive]);
  const handleStatusChange = async (params: GridCellEditCommitParams, event: any) => {
    try {
      const apiUrl = getApiUrl(`/notification/${params.id}`);
      await axios.post(apiUrl, {
        status: params.value,
      });
      reFetch(API_URL);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCellClick = React.useCallback((params: GridCellParams, event: any) => {
    if (params.field !== 'status') return;
    event.stopPropagation();
    setCellModesModel((prevModel) => {
      return {
        // Revert the mode of the other cells from other rows
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: GridCellModes.View },
              }),
              {},
            ),
          }),
          {},
        ),
        [params.id]: {
          // Revert the mode of other cells in the same row
          ...Object.keys(prevModel[params.id] || {}).reduce(
            (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
            {},
          ),
          [params.field]: { mode: GridCellModes.Edit },
        },
      };
    });
  }, []);

  const handleCellModesModelChange = React.useCallback((newModel: GridCellModesModel) => {
    setCellModesModel(newModel);
  }, []);
  return (
    <>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleSearch={handleSearch}
      />
      <Paper elevation={0}>
        <CircularLoader value={loading}>
          <Box style={globalStyles.dataGridLayer}>
            <DataGrid
              initialState={{
                sorting: {
                  sortModel: [{ field: 'createdAt', sort: 'desc' }],
                },
              }}
              columns={columns}
              rows={searchData || []}
              disableColumnSelector={false}
              isRowSelectable={(params: GridRowParams) => false}
              rowHeight={64}
              disableSelectionOnClick
              sx={globalStyles.datagridSx}
              cellModesModel={cellModesModel}
              onCellModesModelChange={handleCellModesModelChange}
              onCellClick={handleCellClick}
              onCellEditCommit={handleStatusChange}
              experimentalFeatures={{ newEditingApi: true }}
              onRowClick={handleRowClick}
              components={{
                Footer: CustomFooter,
              }}
              componentsProps={{
                footer: {
                  active: !showInactive,
                  onSwitchClick: () => setShowInactive(!showInactive),
                },
              }}
            />
          </Box>
        </CircularLoader>
      </Paper>
    </>
  );
}

export default withAuth(NotificationsList);
