// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/gen/pages/farmersList/ui'
import axios from 'axios';

import React, { useMemo, useState } from 'react';

import { Paper, Box } from '@mui/material';
import {
  GridRenderCellParams,
  GridColDef,
  GridValueGetterParams,
  GridRowParams,
} from '@mui/x-data-grid';

import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import ListAction from '~/components/lib/ListAction';

import withAuth from '~/components/auth/withAuth';
import TitleBarGeneric from '~/components/TitleBarGeneric';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import globalStyles from '~/styles/theme/brands/styles';
import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import CropChip from '~/components/CropChip';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import useFetch from 'hooks/useFetch';
import { filterDataByCustomKeys } from '~/components/lib/FilterDataByCustomKeys';

export { default as getServerSideProps } from '~/utils/ggsp';

function POPList() {
  const { changeRoute, getAPIPrefix } = useOperator();
  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'POPs',
    mainBtnTitle: 'Add POP',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: true,
  });
  const API_URL = getAPIPrefix() + '/pop';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data?.length || 0} POPs in total`,
    });
  }, [data]);

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/pop/${params?.row?.id}`);
  };

  function renderSchemesCell(params: GridRenderCellParams) {
    return <CropChip params={params?.row?.schemes || []} Icon={WorkspacePremiumOutlinedIcon} />;
  }

  const handleActivation = () => {
    reFetch(API_URL);
  };

  const handleSearch = (value: any) => {
    setSearchValue(value);
  };

  const handlePOPDuplicate = (id: string) => {
    changeRoute(`/pop/create?duplicate_from_id=${id}`);
  };

  function renderActionCell(params: GridRenderCellParams) {
    return (
      <ListAction
        canActivate={params?.row?.status == 'Draft' ? true : false}
        canEdit={params?.row?.status == 'Draft' ? true : false}
        canDelete={params?.row?.status == 'Draft' ? true : false}
        isActive={params.row.active}
        id={params.row.id}
        schema={'pop'}
        onActivationClick={handleActivation}
        canDuplicate={true}
        handleDuplicate={handlePOPDuplicate}
      />
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 220,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.name}`,
      hideable: false,
    },
    {
      field: 'cropType',
      headerName: 'Crop',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.cropPopType.name}`,
    },
    {
      field: 'cropVariety',
      headerName: 'Crop Variety',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.cropPopType.variety}`,
    },
    {
      field: 'cropSeason',
      headerName: 'Crop Season',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.cropPopType.season}`,
    },
    {
      field: 'cropDurationType',
      headerName: 'Crop Duration Type',
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.cropPopType.durationType}`,
    },
    {
      field: 'cropDurationDays',
      headerName: 'Crop Duration',
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.cropPopType.durationDays}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 100,
      flex: 1,
      renderCell: renderActionCell,
    },
  ];

  const searchData = useMemo(() => {
    if (searchValue?.length > 0) {
      return filterDataByCustomKeys(data, searchValue, [
        'name',
        'cropPopType.name',
        'cropPopType.variety',
        'cropPopType.season',
        'cropPopType.durationType',
        'cropPopType.durationDays',
      ]);
    }
    return data;
  }, [searchValue, data]);

  return (
    <>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleSearch={handleSearch}
        handleMainBtnClick={() => {
          changeRoute('/pop/create');
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
            />
          </Box>
        </CircularLoader>
      </Paper>
    </>
  );
}

export default withAuth(POPList);
