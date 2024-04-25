import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';

export default function CategoryDetails({ data, lpMap, handleFormSubmit, title, Editor }: any) {
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
        <Editor
          formContext={{ map: lpMap }}
          onSubmit={handleFormSubmitAndClose}
          onCancelBtnClick={toggleOpenModal}
        />
      </Dialog>
      <TableView
        getRowId={(item) => item.name}
        name={title}
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
        key={'allied-activities-' + title}
        data={data}
        addBtnVisible={true}
        addBtnTitle={'Add ' + title}
        handleAddBtnClick={toggleOpenModal}
      />
    </>
  );
}
