import React, { useState } from 'react';
import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import DetailsCard from './DetailsCard';
import Dialog from '~/components/lib/Feedback/Dialog';
import dynamic from 'next/dynamic';

const SchemesEditor = dynamic(
  import('~/gen/data-views/landparcel_schemes/landparcel_schemesEditor.rtml'),
);

export default function Schemes(props: any) {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const documents = props?.data?.schemes?.map((scheme: any) => ({
    title: `Scheme: ${scheme.scheme}`,
    subText: `Conversion status: ${scheme.conversionStatus}, Certification status:${scheme.certificationStatus} `,
  }));

  const componentData = [
    {
      title: 'Schemes',
      label: 'Schemes',
      data: documents,
      onClick: () => setOpenModal('schemes'),
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
    switch (openModal) {
      case 'schemes':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <SchemesEditor
              formData={{
                data: {
                  schemes: props?.data?.schemes,
                },
              }}
              onSubmit={handleFormSubmit}
              onCancelBtnClick={handleClose}
            />
          </Dialog>
        );
      default:
        return null;
    }
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
