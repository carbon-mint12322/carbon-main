import React, { useState, ReactNode } from 'react';
import { Box, Typography, Button, IconButton, Paper } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import globalStyles from '~/styles/theme/brands/styles';
export { default as getServerSideProps } from '~/utils/ggsp';
import If, { IfNot } from '~/components/lib/If';
import Dialog from '~/components/lib/Feedback/Dialog';
import dynamic from 'next/dynamic';
import ListActionModal from '~/components/lib/ListActionModal';
import Image from 'next/image';
import { AgricultureOutlined } from '@mui/icons-material';
import { SxProps } from '@mui/material';
import AquaControlPointEditForm from '~/container/aquapop/details/AquaControlPointEditForm';

const AquaControlPointEditor = dynamic(
  import('~/gen/data-views/add_aquacontrolpoint/add_aquacontrolpointEditor.rtml'),
);

interface AquaPopEventProps {
  data: any;
  onClick: () => void;
  cardStyle?: SxProps;
  cardTitleBarStyle?: SxProps;
}

export default function AquaPopEvent({
  data,
  onClick,
  cardStyle = {},
  cardTitleBarStyle = {},
}: AquaPopEventProps) {
  const [show, setShow] = useState(false);
  const [popupData, setPopupData] = useState('');

  const renderActivityType = (data: any) => {
    return (
      <Box component={'div'} sx={styles.imageStyle}>
        <AgricultureOutlined />
        <Box component={'div'}>
          <Typography variant='subtitle1'>{data?.row?.activityType}</Typography>
        </Box>
      </Box>
    );
  };

  const renderTechnicalAdvice = (data: any) => {
    return (
      <Box>
        <If value={data?.row?.technicalAdvice ? false : true}>
          <Typography>NA</Typography>
        </If>
        <IfNot value={data?.row?.technicalAdvice ? false : true}>
          <div>
            <Typography variant='subtitle2'>
              {data?.row?.technicalAdvice?.slice(0, 30)}
              ...
              <Button
                onClick={(e) => {
                  setShow(!show);
                  return setPopupData(data?.row?.technicalAdvice);
                }}
              >
                view more
              </Button>
            </Typography>
          </div>
        </IfNot>
      </Box>
    );
  };

  const styles = {
    renderActionCell: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '14px',
      padding: '8px 0px',
    },
    cardTitleBarStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardStyle: {
      padding: '32px 48px',
    },
    imageStyle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '14px',
      padding: '8px 0px',
    },
    cropChip: {
      background: '#F1F1F1',
      color: 'textPrimary',
    },
    cropChipIcon: {
      color: 'iconColor.default',
    },
  };

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row._id}
          schema={'pop'}
          data={data}
          Editor={AquaControlPointEditForm}
          canActivate={false}
          canEdit={false}
          canDelete={false}
        />
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'activityType',
      headerName: 'Activity type',
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: renderActivityType,
    },
    {
      field: 'activityName',
      headerName: 'Activity name',
      minWidth: 300,
      sortable: false,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params?.row.name}`,
    },
    {
      field: 'period',
      headerName: 'Period',
      sortable: false,
      minWidth: 50,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params?.row.period} days`,
    },
    {
      field: 'days.start',
      headerName: 'Start day (from Chick Placement Day)',

      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params?.row.activityType === 'Chick Placement' ? 0 : params?.row.days.start}`,
    },
    {
      field: 'days',
      headerName: 'End day (from Chick Placement Day)',
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params?.row.activityType === 'Chick Placement' ? 0 : params?.row.days.end}`,
    },

    {
      field: 'tecnicalAdvice',
      headerName: 'Technical advice',
      minWidth: 400,
      flex: 1,
      renderCell: renderTechnicalAdvice,
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

  return (
    <Paper sx={{ ...styles.cardStyle, ...cardStyle }} elevation={0} square={true}>
      <Box
        sx={{
          ...styles.cardTitleBarStyle,
          ...cardTitleBarStyle,
          justifyContent: 'flex-end',
          paddingBottom: '16px',
        }}
      >
        <Button variant={'contained'} color={'primary'} onClick={onClick} size={'small'}>
          {'Add Control Point'}
        </Button>
      </Box>

      <Box style={globalStyles.dataGridLayer}>
        <>
          <DataGrid
            columns={columns}
            rows={data?.controlPoints || []}
            getRowId={(row: any) => row.name}
            disableColumnSelector={true}
            rowHeight={64}
            disableSelectionOnClick={false}
            sortModel={[]} // set sortModel to an empty array
            sx={{
              ...globalStyles.datagridSx,
              '& .MuiDataGrid-virtualScrollerRenderZone': {
                '& .MuiDataGrid-row.Mui-selected': {
                  background: (theme: any) =>
                    `${theme.palette.action.disabledBackground} !important`,
                },
              },
            }}
          />
        </>
      </Box>
      {show && (
        <Dialog
          onClose={() => setShow(!show)}
          open={true}
          dialogContentProps={{ sx: { padding: '10' } }}
          fullWidth
          maxWidth='lg'
        >
          <Typography mt={2} mb='24px'>{`Technical advice`}</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant='subtitle2' style={{ wordWrap: 'break-word' }}>
              {popupData}
            </Typography>
          </Box>
        </Dialog>
      )}
    </Paper>
  );
}
