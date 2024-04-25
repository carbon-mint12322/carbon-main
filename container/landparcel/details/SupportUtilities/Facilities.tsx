import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
const LandParcelSupportUtilEditor = dynamic(
  import('~/gen/data-views/landparcel_supportutilities/landparcel_supportutilitiesEditor.rtml'),
);
export default function Facilities({ data, lpMap, handleFormSubmit }: any) {
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
        <LandParcelSupportUtilEditor
          formContext={{ map: lpMap }}
          onSubmit={handleFormSubmitAndClose}
          onCancelBtnClick={toggleOpenModal}
        />
      </Dialog>
      <TableView
        getRowId={(item) => item.name}
        name='Facilities'
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
          {
            field: 'category',
            headerName: 'Category',
            flex: 1,
          },
        ]}
        key='support-utilities-facilities'
        data={data}
        addBtnVisible={true}
        addBtnTitle={'Add Facility'}
        handleAddBtnClick={toggleOpenModal}
      />
    </>
  );
}
