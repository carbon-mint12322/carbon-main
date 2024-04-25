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
import { filterDataByCustomKeys } from '~/components/lib/FilterDataByCustomKeys';
import _ from 'lodash';

export { default as getServerSideProps } from '~/utils/ggsp';

function ProcessingsystemsList() {
  const { changeRoute, getAPIPrefix } = useOperator();
  const [showInactive, setShowInactive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Processing Systems',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: false,
  });
  const API_URL = getAPIPrefix() + '/processingsystem';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data?.length || 0} Processing Systems in total`,
    });
  }, [data]);

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/processingsystem/${params?.row?.id}`);
  };

  const handleSearch = (value: any) => {
    setSearchValue(value);
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
        isActive={params.row.active}
        id={params.row.id}
        schema={'processingsystem'}
        category={params.row.category}
        onActivationClick={handleActivation}
        canActivate={true}
        canAddEvent={true}
        canEdit={true}
        canDelete={true}
      />
    );
  }

  function getFarmerName(farmer: GridRenderCellParams) {
    if (!farmer.row?.type || farmer.row?.type === 'Farmer') {
      const firstName = _.get(farmer, 'personalDetails.firstName', '');
      const lastName = _.get(farmer, 'personalDetails.lastName', '');
      return `${firstName} ${lastName}`;
    } else {
      return ``;
    }
  }

  function getProcessorName(farmer: GridRenderCellParams) {
    if (farmer.row?.type === 'Processor') {
      const firstName = _.get(farmer, 'personalDetails.firstName', '');
      const lastName = _.get(farmer, 'personalDetails.lastName', '');
      return `${firstName} ${lastName}`;
    } else {
      return ``;
    }
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
      field: 'Field Parcel',
      headerName: 'Field Parcel',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.fields[0]?.fbId}`,
    },
    {
      field: 'Land Parcel',
      headerName: 'Land Parcel',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.landParcels[0]?.name}`,
    },
    {
      field: 'Farmer',
      headerName: 'Farmer',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        getFarmerName(_.get(params, 'row.farmers[0]', {})),
    },
    {
      field: 'processor',
      headerName: 'Processor',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        getProcessorName(_.get(params, 'row.processors[0]', {})),
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
      return filterActive(
        filterDataByCustomKeys(data, searchValue, [
          'name',
          'category',
          'fields.fbId',
          'landParcels.name',
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

export default withAuth(ProcessingsystemsList);
