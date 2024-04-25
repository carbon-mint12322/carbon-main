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

function CertificationBodyList() {
  const { changeRoute, getAPIPrefix } = useOperator();

  const [showInactive, setShowInactive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Certification Bodies',
    mainBtnTitle: 'Add Certification Body',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: true,
  });
  const API_URL = getAPIPrefix() + '/certificationbody';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data?.length || 0} Certification Bodies in total`,
    });
  }, [data]);

  const handleSearch = (value: any) => {
    setSearchValue(value);
  };

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/certificationbody/${params?.row?.id}`);
  };

  function renderSchemesCell(params: GridRenderCellParams) {
    const schemes = params?.row?.schemes?.map(function (scheme: any, index: any) {
      return { id: index, name: scheme };
    });
    return (
      <div className='hidden-scrollbar' style={{ width: '300px', overflowX: 'auto' }}>
        <CropChip params={schemes || []} Icon={WorkspacePremiumOutlinedIcon} />
      </div>
    );
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
        schema={'certificationbody'}
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
      field: 'poc',
      headerName: 'Point of Contact',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.poc}`,
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.phone}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.email}`,
    },
    {
      field: 'address.village',
      headerName: 'Village',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.address?.village ? params.row.address?.village : 'NA'}`,
    },
    {
      field: 'schemes',
      headerName: 'Schemes',
      sortable: false,
      width: 300,
      flex: 1,
      renderCell: renderSchemesCell,
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
          changeRoute('/certificationbody/create');
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

export default withAuth(CertificationBodyList);
