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
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import globalStyles from '~/styles/theme/brands/styles';
import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import CropChip from '~/components/CropChip';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import useFetch from 'hooks/useFetch';
import CustomFooter from '~/components/CustomFooter';
export { default as getServerSideProps } from '~/utils/ggsp';

function ProductList() {
  const { changeRoute, getAPIPrefix } = useOperator();

  const [showInactive, setShowInactive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Products',
    mainBtnTitle: 'Add Product',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: true,
  });
  const API_URL = getAPIPrefix() + '/product';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data?.length || 0} Products in total`,
    });
  }, [data]);

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/product/${params?.row?.id}`);
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
        canEdit={false}
        canDelete={false}
        isActive={params.row.active}
        id={params.row.id}
        schema={'product'}
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
      field: 'id',
      headerName: 'Product ID',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.productId}`,
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.type}`,
    },
    {
      field: 'category',
      headerName: 'Category',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.category}`,
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
    const filterActive = (data: any[]) =>
      data?.filter((item: any) => (showInactive ? !item.active : item.active));

    if (searchValue?.length > 0) {
      return filterActive(filterData(data, searchValue));
    }
    return filterActive(data);
  }, [searchValue, data, showInactive]);

  return (
    <>
      <TitleBarGeneric
        titleBarData={titleBarData}
        handleSearch={handleSearch}
        handleMainBtnClick={() => {
          changeRoute('/product/create');
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

export default withAuth(ProductList);
