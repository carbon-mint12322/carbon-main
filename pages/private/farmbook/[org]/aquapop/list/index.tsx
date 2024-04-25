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

import { filterData } from '~/components/lib/FilterData';

import withAuth from '~/components/auth/withAuth';
import TitleBarGeneric from '~/components/TitleBarGeneric';

import globalStyles from '~/styles/theme/brands/styles';
import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import CropChip from '~/components/CropChip';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import useFetch from 'hooks/useFetch';

export { default as getServerSideProps } from '~/utils/ggsp';

function AquaPOPList() {
  const { changeRoute, getAPIPrefix } = useOperator();
  const API_URL = getAPIPrefix() + '/aquapop';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);
  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Aqua POPs',
    mainBtnTitle: 'Add Aqua POP',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: true,
  });

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data?.length || 0} Aqua POPs in total`,
    });
  }, [data]);

  const handleSearch = (value: any) => {
    setSearchValue(value);
  };

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/aquapop/${params?.row?.id}`);
  };

  function renderSchemesCell(params: GridRenderCellParams) {
    return <CropChip params={params?.row?.schemes || []} Icon={WorkspacePremiumOutlinedIcon} />;
  }

  const handleActivation = () => {
    reFetch(API_URL);
  };

  function renderActionCell(params: GridRenderCellParams) {
    return (
      <ListAction
        canActivate={data?.row?.status == 'Draft' ? true : false}
        canEdit={data?.row?.status == 'Draft' ? true : false}
        canDelete={data?.row?.status == 'Draft' ? true : false}
        isActive={params.row.active}
        id={params.row.id}
        schema={'aquapop'}
        onActivationClick={handleActivation}
      />
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'POP Name',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.name}`,
    },
    {
      field: 'aquaType',
      headerName: 'Aqua Type',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.aquaPopType.aquaType}`,
    },
    {
      field: 'aquaVariety',
      headerName: 'Aqua Variety',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.aquaPopType.variety}`,
    },
    {
      field: 'aquaDurationDays',
      headerName: 'Aqua Duration',
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.aquaPopType.durationDays}`,
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

  const searchData = useMemo(() => {
    if (searchValue?.length > 0) {
      return filterData(data, searchValue);
    }
    return data;
  }, [searchValue, data]);

  return (
    <>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleSearch={handleSearch}
        handleMainBtnClick={() => {
          changeRoute('/aquapop/create');
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

export default withAuth(AquaPOPList);
