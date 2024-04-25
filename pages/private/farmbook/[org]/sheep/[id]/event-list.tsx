import React, { useMemo, useState } from 'react';

import { Paper, Box } from '@mui/material';
import { GridColDef, GridValueGetterParams, GridRowParams } from '@mui/x-data-grid';

import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import withAuth from '~/components/auth/withAuth';
import { useTitleBar } from '~/contexts/TitleBar/TitleBarProvider';
import { initialTitleBarContextValues } from '~/contexts/TitleBar/TitleBarContext';

import globalStyles from '~/styles/theme/brands/styles';
import CircularLoader from '~/components/common/CircularLoader';
import { useOperator } from '~/contexts/OperatorContext';
import useFetch from 'hooks/useFetch';
import { useRouter } from 'next/router';
export { default as getServerSideProps } from '~/utils/ggsp';

function EventList() {
  const { changeRoute, getAPIPrefix } = useOperator();

  const [showInactive, setShowInactive] = useState(false);
  const {
    titleBarData: { searchValue },
    setTitleBarData,
    setHandleMainBtnClick,
  } = useTitleBar();
  const router = useRouter();
  const sheepId = router.query.id;
  const API_URL = getAPIPrefix() + `/sheep/${sheepId}/event-list`;
  const { isLoading: loading, data, reFetch } = useFetch<any>(API_URL);

  React.useEffect(() => {
    setTitleBarData({
      ...initialTitleBarContextValues.titleBarData,
      isTitleBarPresent: true,
      title: 'Sheep Events',
      subTitle: `Showing ${data?.length || 0} Events in total`,
      mainBtnTitle: 'Review',
      isTitlePresent: true,
      isSubTitlePresent: true,
      isSearchBarPresent: false,
      isMainBtnPresent: false,
    });
    setHandleMainBtnClick(() => {
      // open validation view
    });
  }, [data]);

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/sheep/${sheepId}/event/${params?.row?.id}`);
  };

  const searchData = useMemo(() => {
    return data; // for now
  }, [searchValue, data, showInactive]);

  return (
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
  );
}

export default withAuth(EventList);

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    minWidth: 220,
    flex: 1,
    hideable: false,
  },
  {
    field: 'category',
    headerName: 'Category',
    minWidth: 200,
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    minWidth: 200,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => `${params.row.status || '-'}`,
  },
];
