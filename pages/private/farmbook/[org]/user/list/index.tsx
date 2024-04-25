// Generated code (tools/templates/pages/model-page-endpoint.tsx.mustache)
// export { default } from '~/specs/gen/pages/farmersList/ui'

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
import useFetch from 'hooks/useFetch';
import globalStyles from '~/styles/theme/brands/styles';
import AvatarWithName from '~/components/common/AvatarWithName';
import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import CustomFooter from '~/components/CustomFooter';
import { filterDataByCustomKeys } from '~/components/lib/FilterDataByCustomKeys';

export { default as getServerSideProps } from '~/utils/ggsp';

function UsersList() {
  const { changeRoute, getAPIPrefix, operator } = useOperator();
  const [showInactive, setShowInactive] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [titleBarData, setTitleBarData] = useState<any>({
    isTitleBarPresent: true,
    title: 'Users',
    mainBtnTitle: 'Add User',
    isTitlePresent: true,
    isSubTitlePresent: true,
    isSearchBarPresent: true,
    isMainBtnPresent: true,
  });
  const API_URL = getAPIPrefix() + '/user';
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);

  React.useEffect(() => {
    setTitleBarData({
      ...titleBarData,
      subTitle: `Showing ${data
        ? showInactive
          ? data.filter((obj: any) => obj.active === false).length
          : data.filter((obj: any) => obj.active === true).length
        : 0
        } Users in total`,
    });
  }, [data, showInactive]);

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/user/${params?.row?.id}`);
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
        canActivate={true}
        canEdit={true}
        canDelete={false}
        isActive={params.row.active}
        id={params.row.id}
        schema={'user'}
        onActivationClick={handleActivation}
      />
    );
  }

  function renderUserNameCell(params: GridRenderCellParams) {
    const name = `${params.row?.personalDetails?.firstName || ''} ${params.row?.personalDetails?.lastName || ''
      }`;
    return <AvatarWithName name={name} />;
  }

  const columns: GridColDef[] = [
    {
      field: 'userName',
      headerName: 'User Name',
      minWidth: 220,
      flex: 1,
      renderCell: renderUserNameCell,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails?.firstName} ${params.row.personalDetails?.lastName}`,
      hideable: false,
    },
    {
      field: 'personalDetails.identityNumber',
      headerName: 'ID',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalOrgDetails?.identificationNumber
          ? params.row.personalOrgDetails?.identificationNumber
          : 'NA'
        }`,
    },
    {
      field: 'personalDetails.primaryPhone',
      headerName: 'Phone Number',
      minWidth: 200,
      flex: 1,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails?.primaryPhone ? params.row.personalDetails?.primaryPhone : ''
        }`,
    },
    {
      field: 'personalDetails.address.village',
      headerName: 'Village',
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.personalDetails?.address?.village
          ? params.row.personalDetails?.address?.village
          : 'NA'
        }`,
    },
    {
      field: 'roles',
      headerName: 'Roles',
      sortable: false,
      minWidth: 200,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row?.roles?.[operator?.slug as string]
          ? params.row?.roles?.[operator?.slug as string]
          : 'NA'
        }`,
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
          'personalDetails.firstName',
          'personalDetails.lastName',
          'personalDetails.primaryPhone',
          'personalDetails.address.village',
          'roles.farmbook',
          `roles.${process.env.NEXT_PUBLIC_APP_NAME}`,
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
          changeRoute('/user/create');
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

export default withAuth(UsersList);
