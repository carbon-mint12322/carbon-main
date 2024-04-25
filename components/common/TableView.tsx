import { Grid, SxProps, Typography, Paper } from '@mui/material';
import React from 'react';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import styles from '~/styles/theme/brands/styles';
import Button from '@mui/material/Button';
import If from '~/components/lib/If';

interface IProps {
  data: any;
  name: string;
  columnConfig: GridColDef[];
  getRowId?: (item: any) => string;
  checkboxSelection?: boolean;
  addBtnVisible?: boolean;
  addBtnTitle?: string;
  handleAddBtnClick?: () => void;
  handleRowClick?: (params: GridRowParams) => void;
  sx?: SxProps;
}

export default function TableView({
  checkboxSelection = false,
  getRowId = () => '',
  columnConfig,
  name,
  data,
  addBtnVisible,
  addBtnTitle,
  handleAddBtnClick,
  handleRowClick,
  sx = {},
}: IProps) {
  const columns = columnConfig.map((column) => ({ width: 60, ...column }));

  return (
    <Grid container direction='column' rowGap='24px' sx={sx}>
      <Grid container direction='row' justifyContent={'space-between'}>
        <Typography fontSize='16px' fontWeight='600'>
          {name} ({data?.length || 0})
        </Typography>
        <If value={addBtnVisible}>
          <Button
            id={
              addBtnTitle &&
              addBtnTitle
                .toLowerCase()
                .replace(/[^a-zA-Z0-9]+(.)/g, (_: any, chr: string) => chr.toUpperCase())
            }
            variant={'contained'}
            color={'primary'}
            onClick={handleAddBtnClick}
          >
            {addBtnTitle}
          </Button>
        </If>
      </Grid>
      <Grid
        height='fit-content'
        maxHeight='200vh'
        sx={{ bgcolor: 'common.white' }}
        component={Paper}
        elevation={0}
      >
        <DataGrid
          sx={styles.datagridSx}
          getRowId={getRowId}
          autoHeight
          rows={data || []}
          rowsPerPageOptions={[5]}
          columns={columns}
          checkboxSelection={checkboxSelection}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          onRowClick={handleRowClick}
        />
      </Grid>
    </Grid>
  );
}
