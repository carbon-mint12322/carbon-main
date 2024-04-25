import React, { useState } from 'react';
import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import DetailsCard from './DetailsCard';
import Dialog from '~/components/lib/Feedback/Dialog';
import dynamic from 'next/dynamic';

const SupportingDocumentsEditor = dynamic(
  import('~/gen/data-views/supportingDocuments/supportingDocumentsEditor.rtml'),
);

export default function Document(props: any) {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const documents = props?.data?.map((doc: any) => ({
    title: doc.documentType,
    subText: doc.documentDetails,
    url: doc.documentEvidence,
  }));

  const componentData = [
    {
      title: 'Supporting Documents',
      label: 'Supporting Documents',
      data: documents,
      onClick: () => setOpenModal('supportingDocument'),
    },
  ];

  const handleClose = () => {
    setOpenModal(null);
  };

  const handleFormSubmit = async (formData: any) => {
    props.handleFormSubmit(formData);
    setOpenModal(null);
  };

  const renderModal = () => {
    return (
      <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
        <SupportingDocumentsEditor
          formData={{
            data: {
              documents: props?.data?.documents,
            },
          }}
          onSubmit={handleFormSubmit}
          onCancelBtnClick={handleClose}
        />
      </Dialog>
    );
  };

  return (
    <>
      <VerticalTabs
        labels={componentData.map((item: any, index: any) => {
          return { label: item.label };
        })}
        panels={componentData.map((item: any, index: any) => (
          <DetailsCard
            title={item.title}
            key={index}
            items={item.data}
            handleMainBtnClick={item.onClick}
          />
        ))}
      />
      {renderModal()}
    </>
  );
}
