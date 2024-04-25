import React, { useState, ReactNode } from 'react';

import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
export { default as getServerSideProps } from '~/utils/ggsp';
import dynamic from 'next/dynamic';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import { Box, Typography, Button, IconButton, Paper } from '@mui/material';

import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import globalStyles from '~/styles/theme/brands/styles';

import If, { IfNot } from '~/components/lib/If';
import Dialog from '~/components/lib/Feedback/Dialog';

import ListActionModal from '~/components/lib/ListActionModal';
import Image from 'next/image';
import { AgricultureOutlined } from '@mui/icons-material';
import { SxProps } from '@mui/material';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import axios from 'axios';
const CompliancePointEditor = dynamic(
  import('~/gen/data-views/compliancePoint/compliancePointEditor.rtml'),
);

interface SchemePopEventsTabProps {
  data: any;
  childResourceUri: string;
  modelName: string;
  reFetch: () => void;
}

export default function SchemePopEventsTab({
  data,
  childResourceUri,
  modelName,
  reFetch
}: SchemePopEventsTabProps) {
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();
  const [openModal, setOpenModal] = useState(false);



  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
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


  const handleAddCompliancePointFormSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/schemepop/${data._id}/compliancepoint`);

      await axios.post(apiUrl, formData).then((res) => {
        openToast('success', 'Scheme POP details updated');
        handleClose();
      });
      reFetch && reFetch();
    } catch (error: any) {
      openToast('error', 'Failed to update Scheme POP details');
      console.log(error);
    }
  };

  const handleFormSubmit = async (formData: any, id: string) => {
    try {
      const res = await axios.put(
        getApiUrl(`/schemepop/${data._id}/compliancepoint/${id}`),
        formData,
      );

      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated compliance point');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update compliance point');
    }
  };

  const renderActionCell = (item: any) => {
    const row = item.row;
    const popId = data._id;
    const controlPoint = { ...row, popId };

    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={row.active}
          id={row._id}
          schema={`pop`}
          resourceName={'controlpoint'}
          data={{ ...controlPoint }}
          Editor={CompliancePointEditor}
          canActivate={false}
          canEdit={true}
          canDelete={true}
          reFetch={reFetch}
          onSubmit={handleFormSubmit}

        />
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Compliance Name',
      minWidth: 200,
      sortable: false,
      flex: 1,

    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 300,
      sortable: false,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params?.row.description}`,
    },
    {
      field: 'severity',
      headerName: 'Severity',
      sortable: false,
      minWidth: 50,
      flex: 1,
    },
    {
      field: 'score',
      headerName: 'Score',
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params?.row.score ? params?.row.score : 0}`,
    },
    {
      field: 'days.start',
      headerName: 'Start day (from Plantation Day)',
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params?.row.activityType === 'Plantation' ? 0 : params?.row.days.start}`,
    },
    {
      field: 'days.end',
      headerName: 'End day (from Plantation Day)',
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params?.row.activityType === 'Plantation' ? 0 : params?.row.days.end}`,
    },
    {
      field: 'repeated',
      headerName: 'Repeated',
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params?.row.repeated === true ? 'Yes' : 'No'}`,
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
    <Paper sx={{ ...styles.cardStyle, }} elevation={0} square={true}>
      <Box
        sx={{
          ...styles.cardTitleBarStyle,
          justifyContent: 'flex-end',
          paddingBottom: '16px',
        }}
      >
        <Button variant={'contained'} color={'primary'} onClick={handleOpen} size={'small'}>
          {'Add Compliance Point'}
        </Button>
        <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth={'md'}>
          {/* Your ControlPointEditor component */}
          {/* Pass necessary props to your ControlPointEditor component */}
          {/* For example, formData, transformErrors, onSubmit, onCancelBtnClick */}
          {/* You might need to adjust these props based on your ControlPointEditor component's requirements */}
          <CompliancePointEditor
            formData={{
              data: { data },
            }}
            onSubmit={handleAddCompliancePointFormSubmit}
            onCancelBtnClick={handleClose}
          />
        </Dialog>
      </Box>

      <Box style={globalStyles.dataGridLayer}>
        <>
          <DataGrid
            columns={columns}
            rows={data?.compliancePoints || []}
            getRowId={(row: any) => row._id}
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

    </Paper>
  );
}
