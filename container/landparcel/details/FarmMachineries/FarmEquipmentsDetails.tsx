import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
import DetailsCardJsonForm from '~/components/common/DetailsCardJsonForm';

import jsonSchemaFarmEquipments from '~/gen/jsonschemas/farmEquipments.json';
import uiSchemaFarmEquipments from '~/gen/ui-schemas/farmEquipments-ui-schema.json';

export default function FarmEquipmentsDetails({ data, handleFormSubmit, title, Editor }: any) {
  //const [openModal, setOpenModal] = useState<string | null>(null);
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
      <DetailsCardJsonForm
        schema={jsonSchemaFarmEquipments}
        uiSchema={uiSchemaFarmEquipments}
        formData={{
          data: {
            farmEquipments: data?.farmEquipments,
          },
        }}
        title={title}
        key={'farmEquipments-' + title}
        handleMainBtnClick={toggleOpenModal}
      />

      <Dialog open={Boolean(openModal)} onClose={toggleOpenModal} fullWidth maxWidth={'md'}>
        <Editor
          formData={{
            data: {
              farmEquipments: data?.farmEquipments,
            },
          }}
          onSubmit={handleFormSubmitAndClose}
          onCancelBtnClick={toggleOpenModal}
        />
      </Dialog>
    </>
  );
}
