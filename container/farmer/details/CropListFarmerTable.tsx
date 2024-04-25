import React from 'react';
import { Box, Button, IconButton, Paper } from '@mui/material';
import {
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ListAction, { IActivationParams } from '~/components/lib/ListAction';

import CropAndLandParcelCell from '~/components/CropAndLandParcelCell';
import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import CropChip from '~/components/CropChip';

import globalStyles from '~/styles/theme/brands/styles';
import { useOperator } from '~/contexts/OperatorContext';
import { stringDateFormatter } from '~/utils/dateFormatter';

export interface Crop {
  id: number;
  name: string;
  landParcel: { name: string; id: string };
  areaInAcres: number;
  estimatedYieldTones: number;
  croppingSystem: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;
  plannedSowingDate: string;
  estHarvestDate: string;
  category: string;
  field_id: number;
  climateScore: number;
  complianceScore: number;
  seedVariety: string;
  seedSource: string;
  seedType: string;
  recentEvent: RecentEvent;
  status: string;
}

export interface RecentEvent {
  name: string;
  date: string;
}

interface CropListFarmerTableProps {
  data: Crop[];
}

const styles = {
  cropAndLandParcelCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
  cropAndLandParcelSubtitle: { color: 'text.disabled', wordWrap: 'break-word' },
  renderActionCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
  cropChip: {
    padding: '8px 0px 8px 7px',
    color: '#000 !important',
    bgColor: '#F1F1F1 !important',
  },
  cropChipIcon: {
    fill: 'inherit',
    color: 'common.black',
  },
};

export default function CropListFarmerTable(props: CropListFarmerTableProps) {
  const { changeRoute } = useOperator();
  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/crop/${params?.row?.id}`);
  };

  const renderCropAndLandParcelCell = (params: GridRenderCellParams) => {
    return (
      <CropAndLandParcelCell
        title={params?.row?.name}
        subTitle={params?.row?.landParcel?.name}
        sx={styles.cropAndLandParcelCell}
        subTitleSx={styles.cropAndLandParcelSubtitle}
      />
    );
  };

  const handleActivation = (params?: IActivationParams) => {

  };


  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            changeRoute(`/crop/${data?.row?.id}/create-event`);
          }}
        >
          {'Create Event'}
        </Button>
        <ListAction
          canActivate={false}
          canEdit={data?.row?.status == 'Draft' ? true : false}
          canDelete={false}
          isActive={data.row.active}
          id={data.row.id}
          schema={'crop'}
          onActivationClick={handleActivation}
        />
      </Box>
    );
  };

  const renderRecentEvent = (params: GridRenderCellParams) => {
    return (
      <CropChip
        Icon={StickyNote2OutlinedIcon}
        params={[
          {
            id: 1,
            name: params?.row?.recentEvent?.name,
          },
        ]}
        sx={styles.cropChip}
        iconSx={styles.cropChipIcon}
      />
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Crop & Land Parcel',
      minWidth: 250,
      flex: 1,
      renderCell: renderCropAndLandParcelCell,
    },
    {
      field: 'areaInAcres',
      headerName: 'Area (Acres)',
      minWidth: 80,
      flex: 1,
    },
    {
      field: 'estimatedYieldTonnes',
      headerName: 'Estimated Yield (Tonnes)',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'seedVariety',
      headerName: 'Seed Variety',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'seedSource',
      headerName: 'Seed Source',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'plannedSowingDate',
      headerName: 'Sowing Date',
      minWidth: 100,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${stringDateFormatter(params.row.plannedSowingDate)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 1,
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
          checkboxSelection
          autoHeight
        />
      </Box>
    </Paper>
  );
}
