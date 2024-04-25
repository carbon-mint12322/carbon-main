import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
import ListActionModal from '~/components/lib/ListActionModal';
import { Paper, Box, Button } from '@mui/material';
import AquaCropForm from '~/container/aquacrop/create';
import AquaCropEditForm from '~/container/aquacrop/edit';
const LandParcelAquaCropEditor = dynamic(
  import('~/gen/data-views/add_aquacrop/add_aquacropEditor.rtml'),
);

const styles = {
  renderActionCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
  tablePadding: {
    mb: 8,
  },
};

export default function Aquaculture({ data, reFetch, handleFormSubmit }: any) {
  const [openModal, setOpenModal] = useState(false);
  const toggleOpenModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenModal((openModal) => !openModal);
  };
  const handleFormSubmitAndClose = (data: any) => {
    handleFormSubmit(data);
    toggleOpenModal();
  };
  const handleSubmit = () => {
    toggleOpenModal();
  };

  const handleActivation = () => {
    reFetch && reFetch();
  };
  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row.id}
          schema={'aquapond'}
          data={data.row}
          reFetch={reFetch}
          Editor={AquaCropEditForm}
          canActivate={false}
          canEdit={data.row.status == 'Draft' ? true : false}
          canDelete={data.row.status == 'Draft' ? true : false}
        />
      </Box>
    );
  };

  return (
    <>
      <Dialog open={Boolean(openModal)} onClose={toggleOpenModal} fullWidth maxWidth={'md'}>
        <AquaCropForm lpData={data?.lpData} handleSubmit={handleSubmit} reFetch={reFetch} />
      </Dialog>
      <TableView
        getRowId={(item) => item.fbId}
        name='Aquaculture'
        columnConfig={[
          {
            field: 'fbId',
            headerName: 'ID',
            flex: 1,
          },
          {
            field: 'cropType',
            headerName: 'Crop Name',
            flex: 1,
          },
          {
            field: 'cropSubType',
            headerName: 'Sub Type',
            flex: 1,
          },
          {
            field: 'quantity',
            headerName: 'Stocking Quantity (Kgs)',
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
        key='allied-activities-aquaculture-crop'
        data={data?.alliedActivityData?.aquacrops}
        addBtnVisible={true}
        addBtnTitle={'Add Aquaculture Crop'}
        handleAddBtnClick={toggleOpenModal}
      />
    </>
  );
}
