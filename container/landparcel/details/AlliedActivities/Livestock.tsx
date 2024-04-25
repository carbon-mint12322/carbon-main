import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
const LandParcelAlliedActEditor = dynamic(
  import('~/gen/data-views/landparcel_alliedactivities/landparcel_alliedactivitiesEditor.rtml'),
);
export default function Livestock({ data, handleFormSubmit }: any) {
  const [openModal, setOpenModal] = useState(false);
  const toggleOpenModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenModal((openModal) => !openModal);
  };
  const handleFormSubmitAndClose = (data: any) => {
    handleFormSubmit(data);
    toggleOpenModal();
  };
  return (
    <>
      <Dialog open={Boolean(openModal)} onClose={toggleOpenModal} fullWidth maxWidth={'md'}>
        <LandParcelAlliedActEditor
          onSubmit={handleFormSubmitAndClose}
          onCancelBtnClick={toggleOpenModal}
        />
      </Dialog>
      <TableView
        getRowId={(item) => item.name}
        name='Livestock'
        columnConfig={[
          {
            field: 'name',
            headerName: 'Name',
            flex: 1,
          },
          {
            field: 'size',
            headerName: 'Size',
            flex: 1,
          },
          {
            field: 'capacity',
            headerName: 'Capacity',
            flex: 1,
          },
        ]}
        key='allied-activities-livestock'
        data={data}
        addBtnVisible={true}
        addBtnTitle={'Add Allied Activity'}
        handleAddBtnClick={toggleOpenModal}
      />
    </>
  );
}
