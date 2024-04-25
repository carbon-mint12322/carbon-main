// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
import React, { useMemo, useState } from 'react';

import { Box, Button, IconButton, Paper } from '@mui/material';
import { GridColDef, GridRowParams, GridValueGetterParams } from '@mui/x-data-grid';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';

import { filterData } from '~/components/lib/FilterData';
import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import CropAndLandParcelCell from '~/components/CropAndLandParcelCell';
import CropChip from '~/components/CropChip';
import CircularLoader from '~/components/common/CircularLoader';

import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import globalStyles from '~/styles/theme/brands/styles';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { useOperator } from '~/contexts/OperatorContext';
import axios from 'axios';
export { default as getServerSideProps } from '~/utils/ggsp';
import ListAction from '~/components/lib/ListAction';

import useFetch from 'hooks/useFetch';

import CustomFooter from '~/components/CustomFooter';

const styles = {
  cropAndLandParcelCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
  goatAndLandParcelSubtitle: { color: 'text.disabled', wordWrap: 'break-word' },
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

export default function Goats() {
  const { changeRoute, getAPIPrefix } = useOperator();

  const [showInactive, setShowInactive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Goats',
    mainBtnTitle: 'Add Goat',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: false,
  });
  const API_URL = getAPIPrefix() + '/goat';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data?.length || 0} goats in total`,
    });
  }, [data]);

  const handleRowClick = (params: any) => {
    changeRoute(`/goat/${params?.row?.id}`);
  };

  const searchData = useMemo(() => {
    const filterActive = (data: any[]) =>
      data?.filter((item: any) => (showInactive ? !item.active : item.active));

    if (searchValue?.length > 0) {
      return filterActive(filterData(data, searchValue));
    }
    return filterActive(data);
  }, [searchValue, data, showInactive]);

  const renderCropAndLandParcelCell = (data: any) => {
    return (
      <CropAndLandParcelCell
        title={data?.row?.tagId}
        subTitle={data?.row?.landParcel.name}
        sx={styles.cropAndLandParcelCell}
        subTitleSx={styles.goatAndLandParcelSubtitle}
      />
    );
  };

  const handleActivation = () => {
    reFetch(API_URL);
  };

  const handleSearch = (value: any) => {
    setSearchValue(value);
  };

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            changeRoute(`/goat/${data?.row?.id}/create-event`);
          }}
        >
          {'Create Event'}
        </Button>
        <ListAction
          canActivate={data?.row?.status == 'Draft' ? true : false}
          canEdit={data?.row?.status == 'Draft' ? true : false}
          canDelete={data?.row?.status == 'Draft' ? true : false}
          isActive={data.row.active}
          id={data.row.id}
          schema={'goat'}
          onActivationClick={handleActivation}
        />
      </Box>
    );
  };

  const renderRecentEvent = (data: any) => {
    const recentEvent = data?.row?.events?.[0];
    if (!recentEvent) {
      return null;
    }
    const name = data?.row?.status === 'Completed' ? 'Harvest' : recentEvent?.name;
    return (
      <CropChip
        params={[
          {
            name: name,
            id: 1,
          },
        ]}
        Icon={StickyNote2OutlinedIcon}
        sx={styles.cropChip}
        iconSx={styles.cropChipIcon}
      />
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'goatName',
      headerName: 'Goat & Land parcel',
      minWidth: 220,
      flex: 1,
      renderCell: renderCropAndLandParcelCell,
    },
    {
      field: 'farmer.name',
      headerName: 'Farmer',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.farmer.name}`,
    },
    {
      field: 'age',
      headerName: 'Age',
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.age}`,
    },
    {
      field: 'breed',
      headerName: 'Breed',
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.breed}`,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.gender}`,
    },
    {
      field: 'event.category',
      headerName: 'Recent Event',
      sortable: false,
      minWidth: 200,
      flex: 1,
      renderCell: renderRecentEvent,
    },
    {
      field: 'event.createdAt',
      headerName: 'Event Date',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params?.row?.status === 'Completed'
          ? `${stringDateFormatter(params.row.actualHarvestDate)}`
          : `${params.row.events[0]?.createdAt
            ? stringDateFormatter(params.row.events[0]?.createdAt)
            : 'NA'
          }`,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.status}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
      flex: 1,
      renderCell: renderActionCell,
    },
  ];

  return (
    <>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleSearch={handleSearch}
        handleMainBtnClick={() => {
          changeRoute('/goat/create');
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
              getRowClassName={(params: GridRowParams) =>
                `${!params.row.active ? 'datagridrowhover disabled-row' : 'datagridrowhover'}`
              }
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
