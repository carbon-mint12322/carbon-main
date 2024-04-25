// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/specs/gen/pages/farmersList/ui'
import { Box, Typography, Popover, Paper } from '@mui/material';

import React, { useMemo, useState, MouseEvent } from 'react';

import {
  GridRenderCellParams,
  GridColDef,
  GridValueGetterParams,
  GridRowParams,
  GridCellModesModel,
} from '@mui/x-data-grid';
import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import ListAction from '~/components/lib/ListAction';

import If from '~/components/lib/If';

import { filterData } from '~/components/lib/FilterData';

import withAuth from '~/components/auth/withAuth';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import globalStyles from '~/styles/theme/brands/styles';
import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';

import useFetch from 'hooks/useFetch';

import CustomFooter from '~/components/CustomFooter';
import { isoToLocal } from '~/utils/dateFormatter';

export { default as getServerSideProps } from '~/utils/ggsp';

function NotificationsList() {
  const [anchorElMap, setAnchorElMap] = useState<{ [key: string]: HTMLElement | null }>({});

  const { changeRoute, getAPIPrefix, getApiUrl } = useOperator();
  const [showInactive, setShowInactive] = useState(false);
  const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});
  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Mobile Notifications',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: false,
  });
  const API_URL = getAPIPrefix() + '/mobile-notifications';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data?.length || 0} notifications in total`,
    });
  }, [data]);

  const handleSearch = (value: any) => {
    setSearchValue(value);
  };
  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/${params.row?.message.type}/${params?.row?.relatedTo?.objectId}`);
  };

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
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
      setAnchorElMap((prevState) => ({
        ...prevState,
        [id]: event.currentTarget,
      }));
    };

    const handlePopoverClose = (id: string) => {
      setAnchorElMap((prevState) => ({
        ...prevState,
        [id]: null,
      }));
    };

    return (
      <Box component={'div'} sx={styles.cropAndLandParcelCell}>
        <Box component={'div'}>
          <If value={data?.message}>
            <Typography variant='subtitle1' sx={styles.cropAndLandParcelCell}>
              {data?.message?.message && (
                <div
                  onMouseEnter={(event: MouseEvent<HTMLElement>) => {
                    handlePopoverOpen(event, data.id); // Pass the unique identifier (e.g., data.id) for the row
                  }}
                  onMouseLeave={() => {
                    handlePopoverClose(data.id); // Pass the unique identifier (e.g., data.id) for the row
                  }}
                >
                  {data?.message?.message}
                </div>
              )}
            </Typography>
            <Popover
              sx={{
                pointerEvents: 'none',
                padding: '4px',
              }}
              open={Boolean(anchorElMap[data.id])} // Use the anchorElMap to check if popover should be open for this row
              anchorEl={anchorElMap[data.id]} // Use the anchorElMap to set the anchorEl for this row
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={() => {
                handlePopoverClose(data.id); // Pass the unique identifier (e.g., data.id) for the row
              }}
              disableRestoreFocus
            >
              <Box
                sx={{
                  padding: '1rem',
                }}
              >
                <Box sx={{ padding: '1rem' }}>
                  {data.message.message.includes('%0A') ? (
                    <>
                      <Typography variant='body1'>
                        {data.message.message.split('%0A')[0]}
                      </Typography>
                      <Typography variant='body1'>
                        {data.message.message.split('%0A')[1]}
                      </Typography>
                      <Typography variant='body1'>
                        {data.message.message.split('%0A')[2]}
                      </Typography>
                      <Typography variant='body1'>
                        {data.message.message.split('%0A')[3]}
                      </Typography>
                      <Typography variant='body1'>
                        {data.message.message.split('%0A')[4]}
                      </Typography>
                      <Typography variant='body1'>
                        {data.message.message.split('%0A')[5]}
                      </Typography>
                    </>
                  ) : (
                    <pre>
                      <span key={1}>
                        <Typography variant='body1'>{data?.message?.message} </Typography>
                      </span>
                    </pre>
                  )}
                </Box>
              </Box>
            </Popover>
          </If>
          <If value={data?.landParcel}>
            <Typography variant='subtitle2' sx={styles.cropAndLandParcelSubtitle}>
              {data?.landParcel?.name}
            </Typography>
          </If>
          <If value={data?.crop}>
            <Typography variant='subtitle2' sx={styles.cropAndLandParcelSubtitle}>
              {data?.crop?.landParcel?.name}
              {` : `}
              {data?.crop?.name}
            </Typography>
          </If>
          <If value={data?.productionSystem?.[0]}>
            <Typography variant='subtitle2' sx={styles.cropAndLandParcelSubtitle}>
              {data?.productionSystem?.[0]?.landparcel?.[0]?.name}
              {` : `}
              {data?.productionSystem?.[0]?.name} ({data?.productionSystem?.[0]?.category})
            </Typography>
          </If>
        </Box>
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date & Time',
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => isoToLocal(params.row.createdAt),
      type: 'dateTime',
    },
    {
      field: 'reciever',
      headerName: 'Reciever',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params?.row?.recieverDetails[0]?.personalDetails?.firstName +
        (params?.row?.recieverRoles ? ' (' + params?.row?.recieverRoles + ')' : ''),
    },

    {
      field: 'message',
      headerName: 'Message',
      minWidth: 500,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => renderCropAndLandParcelCell(params?.row),
      hideable: false,
    },
    {
      field: 'crop',
      headerName: 'Crop',
      minWidth: 50,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => params?.row?.cropDetails?.[0]?.name,
    },
    {
      field: 'landparcel',
      headerName: 'Land parcel',
      minWidth: 50,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params?.row?.cropDetails?.[0]?.landParcel?.name,
    },

    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => params?.row?.status,
    },
  ];

  const searchData = useMemo(() => {
    const filterActive = (data: any[]) =>
      data?.filter((item: any) => (showInactive ? !item.active : item.active));

    if (searchValue?.length > 0) {
      return filterActive(filterData(data, searchValue));
    }
    return filterActive(data);
  }, [searchValue, data, showInactive]);

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
              onRowClick={handleRowClick}
              columns={columns}
              rows={searchData || []}
              disableColumnSelector={false}
              isRowSelectable={(params: GridRowParams) => false}
              rowHeight={64}
              disableSelectionOnClick
              sx={globalStyles.datagridSx}
              cellModesModel={cellModesModel}
              onCellModesModelChange={handleCellModesModelChange}
              experimentalFeatures={{ newEditingApi: true }}
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
