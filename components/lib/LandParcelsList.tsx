import React from 'react';
import { Box, Paper, Typography, Grid, Button, useTheme, Theme, ListItemIcon } from '@mui/material';
import { LayersOutlined, SettingsCellSharp } from '@mui/icons-material';
import { calculatePolygonArea } from '~/utils/mapUtils';
import { coordinateStringToCoordinateObject } from '~/utils/coordinatesFormatter';
import {
  GridRenderCellParams,
  GridColDef,
  GridValueGetterParams,
  GridRowParams,
  GridSelectionModel,

} from '@mui/x-data-grid';
import _ from 'lodash';

import ListAction, { IActivationParams } from '~/components/lib/ListAction';

import CropAndLandParcelCell from '~/components/CropAndLandParcelCell';
import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import CropChip from '~/components/CropChip';

import globalStyles from '~/styles/theme/brands/styles';
import { useOperator } from '~/contexts/OperatorContext';
import { stringDateFormatter } from '~/utils/dateFormatter';

export interface RecentEvent {
  name: string;
  date: string;
}

interface LandParcelsListProps {
  data: any;
  reFetch: () => void;
}

const styles = {


  renderActionCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },

};

export default function LandParcelsList(props: LandParcelsListProps) {
  const { changeRoute } = useOperator();
  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/landparcel/${params?.row?.id}`);
  };

  const handleActivation = (params?: IActivationParams) => {
  };


  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            changeRoute(`/landparcel/${data?.row?.id}/create-event`);
          }}
        >
          {'Create Event'}
        </Button>
        <ListAction
          canActivate={false}
          canEdit={false}
          canDelete={false}
          isActive={data.row.active}
          id={data.row.id}
          schema={'ladparcel'}
          onActivationClick={handleActivation}
        />
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Grid
          container
          flexWrap='nowrap'
          minWidth='fit-content'
          pr='10px'
          alignItems='center'
          gap={1}
        >
          <Grid
            container
            alignItems='center'
            justifyContent='center'
            width='fit-content'
            p='8px'
            borderRadius='8px'
            sx={{
              bgcolor: (theme: Theme) => `${theme.palette.primary.main}30`,
            }}
          >
            <LayersOutlined fontSize='medium' sx={{ color: 'iconColor.default' }} />
          </Grid>
          <Typography sx={{ minWidth: 'fit-content' }}>{params.row.name}</Typography>
        </Grid>
      ),
      flex: 2,
    },
    {
      field: 'areaInAcres',
      headerName: 'Area (Acres)',
      flex: 1,
      minWidth: 100,
      valueGetter: (params: GridValueGetterParams) => params?.row?.areaInAcres,
      renderCell: (params: GridValueGetterParams) => `${params?.row?.areaInAcres}`,
    },
    {
      field: 'area',
      headerName: 'Calculated Area (Acres)',
      minWidth: 100,
      valueGetter: (params: GridValueGetterParams) =>
        `${_.round(
          calculatePolygonArea({
            paths: coordinateStringToCoordinateObject(params?.row?.map),
          }) || 0,
          2,
        )}`,
      flex: 1,
    },

    {
      field: 'address',
      headerName: 'Address',
      minWidth: 150,
      valueGetter: (params: GridValueGetterParams) =>
        `${params?.row?.address?.village}, ${params?.row?.address?.state}`,
      flex: 2,
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      flex: 1,
      minWidth: 130,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.active ? params.row.status : 'Deactivated'}`,
    },
    {
      field: 'Actions',
      headerName: 'Actions',
      minWidth: 200,
      renderCell: renderActionCell,
    },
  ];

  return (
    <Paper elevation={1} square={true}>
      <Box>
        <DataGrid
          columns={columns}
          rows={props?.data || []}
          disableColumnSelector={false}
          isRowSelectable={(params: GridRowParams) => true}
          rowHeight={64}
          disableSelectionOnClick={false}
          sx={globalStyles.datagridSx}
          onRowClick={handleRowClick}

          autoHeight
        />
      </Box>
    </Paper>
  );
}
