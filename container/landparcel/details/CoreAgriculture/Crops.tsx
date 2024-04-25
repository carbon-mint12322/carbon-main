import { log } from 'console';
import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import If from '~/components/lib/If';
import CropForm from '~/container/crop/create';

import TableView from '~/container/landparcel/details/TableView';
import { GridColDef, GridRowParams, GridValueGetterParams } from '@mui/x-data-grid';
import { LandParcel, LandParcelCrop } from '~/frontendlib/dataModel';
import { Paper, Box, Button } from '@mui/material';
import axios from 'axios';
import ListAction from '~/components/lib/ListAction';
import { useAlert } from '~/contexts/AlertContext';

interface CoreAgricultureProps {
  lpData: LandParcel;
  cropsData: LandParcelCrop[];
  buttonVisible: boolean;
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

export default function Crops(props: CoreAgricultureProps) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { openToast } = useAlert();
  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleFormSubmit = () => {
    setOpenDialog(false);
  };

  const handleActivation = () => {
    props?.reFetch && props.reFetch();
  };

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListAction
          canDelete={data?.row?.cropEvents.length > 0 ? false : true}
          isActive={data.row.active}
          id={data.row.id}
          schema={'crop'}
          onActivationClick={handleActivation}
          canActivate={false}
          canEdit={true}
        />
      </Box>
    );
  };

  return (
    <>
      <TableView
        getRowId={(item) => item._id}
        name='Crops'
        columnConfig={[
          {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.name}`,
          },
          {
            field: 'estimatedYieldTonnes',
            headerName: 'Estimated Yield (tons)',
            flex: 1,
            width: 100,
            valueGetter: (params: GridValueGetterParams) =>
              params.row.estimatedYieldTonnes ? `${params.row.estimatedYieldTonnes.toFixed(2)}` : 'NA',
          },
          {
            field: 'fieldId',
            headerName: 'Field ID',
            flex: 1,
            width: 100,
            valueGetter: (params: GridValueGetterParams) => `${params.row.fieldId}`,
          },
          {
            field: 'seedVariety',
            headerName: 'Seed Variety',
            flex: 1,
            width: 100,
            valueGetter: (params: GridValueGetterParams) => `${params.row.seedVariety}`,
          },
          {
            field: 'seedSource',
            headerName: 'Seed Source',
            width: 160,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.seedSource}`,
          },
          {
            field: 'fbId',
            headerName: 'Crop ID',
            flex: 1,
            width: 100,
            valueGetter: (params: GridValueGetterParams) =>
              params.row.fbId ? `${params.row.fbId}` : '-',
          },
          {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            width: 100,
          },
          {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 100,
            flex: 1,
            renderCell: renderActionCell,
          },
        ]}
        key='core-agriculture-crops'
        data={props.cropsData}
        addBtnVisible={props.buttonVisible}
        addBtnTitle={'Add Crop'}
        handleAddBtnClick={() => {
          {
            props.lpData.farmer
              ? setOpenDialog(true)
              : openToast('error', 'Please link a farmer to the land parcel to add a crop.');
          }
        }}
      />
      <If value={openDialog}>
        <Dialog
          fullWidth={true}
          maxWidth={'lg'}
          open={openDialog}
          onClose={handleClose}
          title={'Add Crop'}
        >
          <CropForm
            lpData={props.lpData}
            handleSubmit={handleFormSubmit}
            reFetch={props.reFetch}
            handleClose={handleClose}
          />
        </Dialog>
      </If>
    </>
  );
}
