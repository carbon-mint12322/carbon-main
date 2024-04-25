import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
import { Paper, Box, Button } from '@mui/material';
import ListActionModal from '~/components/lib/ListActionModal';
import Create from '~/gen/page-components/poultrybatch/create';
import PoultryEditForm from '~/container/poultry/edit';
import { GridValueGetterParams } from '@mui/x-data-grid';

const styles = {
  renderActionCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
};

export default function PoultryBatchDetails({ data, title, reFetch }: any) {
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

  //console.log('Input data for poultry batch details', data);

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row.id}
          schema={'poultrybatch'}
          data={data.row}
          reFetch={reFetch}
          wfName={'poultrybatch'}
          canActivate={false}
          canEdit={data.row.status == 'Draft' || data.row.status == 'editable' ? true : false}
          canDelete={data.row.status == 'Draft' || data.row.status == 'editable' ? true : false}
        />
      </Box>
    );
  };
  return (
    <>
      <Dialog open={Boolean(openModal)} onClose={toggleOpenModal} fullWidth maxWidth={'md'}>
        <Create
          landParcelId={data?.lpData._id}
          negateMargin={true}
        />
      </Dialog>
      <TableView
        getRowId={(item) => item?.id}
        name={title}
        columnConfig={[
          {
            field: 'batchIdName',
            headerName: 'Batch Id/Name',
            valueGetter: (params: GridValueGetterParams) => `${params.row.batchIdName}`,
            flex: 1,
          },
          {
            field: 'purpose',
            headerName: 'Purpose',
            valueGetter: (params: GridValueGetterParams) => `${params.row.purpose}`,
            flex: 1,
          },
          {
            field: 'size',
            headerName: 'Size',
            valueGetter: (params: GridValueGetterParams) => `${params.row.size}`,
            flex: 1,
          },
          {
            field: 'breed',
            headerName: 'Breed',
            valueGetter: (params: GridValueGetterParams) => `${params.row.breed}`,
            flex: 1,
          },
          {
            field: 'chickPlacementDay',
            headerName: 'Start Date',
            valueGetter: (params: GridValueGetterParams) => `${params.row.chickPlacementDay}`,
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
        key={'allied-activities-' + title}
        data={data?.alliedActivityData?.poultryBatches}
        addBtnVisible={true}
        addBtnTitle={'Add Poultry Batch'}
        handleAddBtnClick={toggleOpenModal}
      />
    </>
  );
}
