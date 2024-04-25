import React from 'react';

import { DataGrid as MuiDataGrid, DataGridProps as MuiDataGridProps } from '@mui/x-data-grid';

interface DataGridProps extends MuiDataGridProps {}

export default function DataGrid({ sx = {}, ...props }: DataGridProps) {
  return (
    <MuiDataGrid
      pagination
      rowBuffer={25}
      rowThreshold={25}
      {...props}
      sx={{
        ...sx,
      }}
    />
  );
}
