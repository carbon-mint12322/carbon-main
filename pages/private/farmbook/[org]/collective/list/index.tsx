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
import useFetch from 'hooks/useFetch';
import CustomFooter from '~/components/CustomFooter';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import CustomColumnMenu from 'CustomColumnMenu';
import { filterDataByCustomKeys } from '~/components/lib/FilterDataByCustomKeys';

export { default as getServerSideProps } from '~/utils/ggsp';

function CollectivesList() {
  const { changeRoute, getAPIPrefix } = useOperator();
  const [showInactive, setShowInactive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Operators',
    mainBtnTitle: 'Add Operator',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: true,
  });
  const API_URL = getAPIPrefix() + '/collective';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data
        ? showInactive
          ? data.filter((obj: any) => obj.active === false).length
          : data.filter((obj: any) => obj.active === true).length
        : 0
        } Operators in total`,
    });
  }, [data, showInactive]);

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/collective/${params?.row?.id}`);
  };

  function renderSchemesCell(params: GridRenderCellParams) {
    const schemesAttached = params?.row?.schemeDetails || [];
    const schemeNames: any[] = [];
    schemesAttached?.forEach((scheme: any) => {
      schemeNames.push({ id: 0, name: scheme?.scheme });
    });
    return <CropChip params={schemeNames} Icon={WorkspacePremiumOutlinedIcon} />;
  }

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
        isActive={params.row.active}
        id={params.row.id}
        schema={'collective'}
        onActivationClick={handleActivation}
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
      field: 'category',
      headerName: 'Category',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.category}`,
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.phone ? params.row.phone : ''}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.email ? params.row.email : ''}`,
    },
    {
      field: 'personalDetails.address.village',
      headerName: 'Village',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.address?.village ? params.row.address?.village : 'NA'}`,
    },
    ...(process.env.NEXT_PUBLIC_APP_NAME === 'farmbook'
      ? [
        {
          field: 'schemes',
          headerName: 'Schemes',
          sortable: false,
          width: 300,
          flex: 1,
          renderCell: renderSchemesCell,
        },
      ]
      : []),
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
    const filterActive = (data: any[]) =>
      data?.filter((item: any) => (showInactive ? !item.active : item.active));

    if (searchValue?.length > 0) {
      return filterActive(
        filterDataByCustomKeys(data, searchValue, [
          'name',
          'category',
          'phone',
          'email',
          'address.village',
          'schemes.scheme',
        ]),
      );
    }
    return filterActive(data);
  }, [searchValue, data, showInactive]);

  return (
    <>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleSearch={handleSearch}
        handleMainBtnClick={() => {
          changeRoute('/collective/create');
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
                ColumnMenu: CustomColumnMenu,
              }}
              componentsProps={{
                footer: {
                  active: !showInactive,
                  showActiveSwitch: true,
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

export default withAuth(CollectivesList);
