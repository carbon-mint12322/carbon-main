import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
import ListActionModal from '~/components/lib/ListActionModal';
import { Box, Paper, Typography } from '@mui/material';
import MasterCropForm from '~/container/mastercrop/create';
import MasterCropEditForm from '~/container/mastercrop/edit';

interface MasterCropDetailsProps {
  data: any;
  reFetch: () => void;
}

export default function MasterCropDetails({ data, reFetch }: MasterCropDetailsProps) {
  const [openModal, setOpenModal] = useState(false);

  const toggleOpenModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenModal((openModal) => !openModal);
  };

  const handleSubmit = () => {
    toggleOpenModal();
  };

  const handleActivation = () => {
    reFetch && reFetch();
  };

  const styles = {
    renderActionCell: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '14px',
      padding: '8px 0px',
    },
  };

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row._id}
          schema={'mastercrop'}
          data={data.row}
          reFetch={reFetch}
          Editor={MasterCropEditForm}
          canActivate={false}
          canEdit={true}
          canDelete={true}
        />
      </Box>
    );
  };
  return (
    <>
      <Dialog open={Boolean(openModal)} onClose={toggleOpenModal} fullWidth maxWidth={'md'}>
        <MasterCropForm collective={data?.id} handleSubmit={handleSubmit} reFetch={reFetch} />
      </Dialog>
      <TableView
        getRowId={(item) => (item?.mcId ? item?.mcId : item?.fbId)}
        name={`Master Crops`}
        columnConfig={[
          {
            field: 'fbId',
            headerName: 'ID',
            flex: 1,
          },
          {
            field: 'name',
            headerName: 'Master Crop Name',
            flex: 1,
          },
          {
            field: 'cropName',
            headerName: 'Crop Name',
            flex: 1,
          },
          {
            field: 'cropType',
            headerName: 'Type',
            flex: 1,
          },
          {
            field: 'seedVariety',
            headerName: 'Seed Variety',
            flex: 1,
          },
          {
            field: 'seedSource',
            headerName: 'Seed Source',
            flex: 1,
          },
          {
            field: 'season',
            headerName: 'Season',
            flex: 1,
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
        key={'masterCrop-list'}
        data={data?.mastercrops}
        addBtnVisible={true}
        addBtnTitle={'Add Master Crop'}
        handleAddBtnClick={toggleOpenModal}
      />
    </>
  );
}
