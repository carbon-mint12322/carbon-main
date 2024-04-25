import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { FarmerPersonalDetails } from '~/frontendlib/dataModel';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';
import ProcessorDetailsBioCardContent from './ProcessorDetailsBioCardContent';
import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import Dialog from '~/components/lib/Feedback/Dialog';

import FarmerSchemeDetails from '~/container/farmer/details/FarmerSchemeDetails';
import ProcessorSchemeDetails from '~/container/processor/details/ProcessorSchemeDetails';
import UploadFileDialog from '~/components/UploadFileDialog';
import { PropaneSharp } from '@mui/icons-material';

const FarmerPersonalDetailsEditor = dynamic(
  import('~/gen/data-views/farmerPersonalDetails/farmerPersonalDetailsEditor.rtml'),
);
const FarmerIdentityVerificationEditor = dynamic(
  import('~/gen/data-views/farmerIdentityVerification/farmerIdentityVerificationEditor.rtml'),
);

const FarmerBankDetailsEditor = dynamic(
  import('~/gen/data-views/farmer_bankdetails/farmer_bankdetailsEditor.rtml'),
);

const FarmerAdditionalDocumentsEditor = dynamic(
  import('~/gen/data-views/farmerAdditionalDocuments/farmerAdditionalDocumentsEditor.rtml'),
);

export default function ProcessorDetailsBioVerticalTabs(props: any) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const bioItems = [
    {
      title: 'Full Name',
      subText: `${props.data?.personalDetails?.firstName || ''} ${props.data?.personalDetails?.lastName || ''
        }`,
    },
    { title: 'Phone Number', subText: props.data?.personalDetails?.primaryPhone },
    {
      title: 'Address',
      subText:
        props.data?.personalDetails?.address?.village +
        ' • ' +
        props.data?.personalDetails?.address?.state,
    },
    { title: 'Gender', subText: props.data?.gender },
    { title: 'Date of Birth', subText: props.data?.dob },
    {
      title: 'Processing Experience in Years',
      subText: props.data?.processingExperience ? props.data?.processingExperience : '',
    },
  ];
  const handleFormSubmit = async (formData: any) => {
    props.handleFormSubmit(formData);
    setOpenModal(null);
  };

  const handleIdentityDetailsSubmit = async (formData: any) => {
    props.handleIdentityDetailsSubmit(formData);
    setOpenModal(null);
  };

  const IdVerificationData = [
    {
      title: 'Identification Number',
      subText: props.data?.personalDetails?.identityDetails?.identityNumber
        ? 'XXXX-XXXX-'.concat(
          props.data?.personalDetails?.identityDetails?.identityNumber
            ?.toString()
            .slice(
              props.data?.personalDetails?.identityDetails?.identityNumber?.toString().length - 4,
              props.data?.personalDetails?.identityDetails?.identityNumber?.toString(),
            ),
        )
        : 'NA',
    },
    {
      subText: `Identification Document: ${props.data?.personalDetails?.identityDetails?.identityDocument
        ? props.data?.personalDetails?.identityDetails?.identityDocument
        : 'NA'
        }`,
      url: props.data?.personalDetails?.identityDetails?.identityDocumentFile,
    },
    {
      title: 'PAN Card Number',
      subText: props.data?.personalDetails?.identityDetails?.panCardNumber,
    },
    {
      subText: 'PAN Card',
      url: props.data?.personalDetails?.identityDetails?.panCardFile,
    },
  ];

  const orgDetails = [
    { title: 'Farmer ID', subText: props.data?.operatorDetails?.farmerID || props.data?.fbId },
    {
      title: 'Joining Date',
      subText: props.data?.operatorDetails?.joiningDate,
    },
    {
      subText: 'Operator Registration Document',
      url: props.data?.operatorDetails?.identityDocument,
    },
    {
      title: 'Farmer Subgroup',
      subText: props.data?.operatorDetails?.subgroup?.name,
    },
  ];

  const bankDetails = [
    { title: 'Name of the bank', subText: props.data?.bankDetails?.name },
    {
      title: 'Branch name',
      subText: props.data?.bankDetails?.branch,
    },
    { title: 'Account number', subText: props.data?.bankDetails?.accountNumber },
    {
      title: 'IFSC code',
      subText: props.data?.bankDetails?.ifsc,
    },
    {
      title: 'SWIFT code',
      subText: props.data?.bankDetails?.swift,
    },
    {
      subText: 'Bank Document',
      url: props.data?.bankDetails?.bankDocument,
    },
  ];

  const documents = props.data?.documents?.map((doc: any) => ({
    title: doc.documentType,
    subText: doc.documentDetails,
    url: doc.documentEvidence,
  }));

  const agents = props.data?.agentsDetails?.map((agent: any) => ({
    subText: agent.personalDetails?.firstName.concat(' ').concat(agent.personalDetails?.lastName),
  }));

  const componentData = [
    {
      label: 'Basic Info',
      data: bioItems,
      title: 'Basic Info',
      onClick: () => setOpenModal('basicInfo'),
    },
    {
      label: 'ID & Verification',
      data: IdVerificationData,
      title: 'ID & Verification',
      onClick: () => setOpenModal('idVerification'),
    },

    {
      label: 'Bank Details',
      data: bankDetails,
      title: 'Bank Details',
      onClick: () => setOpenModal('bankDetails'),
    },
    {
      label: 'Additional Documents',
      data: documents,
      title: 'Additional Documents',
      onClick: () => setOpenModal('additionalDocuments'),
    },
    {
      label: 'Field Officers',
      data: agents,
      title: 'Assigned Field Officers ( ' + (agents ?? [])?.length + ' ):',
    },
    {
      label: 'Schemes',
      count: props.data?.processorSchemes?.length || 0,
      title: 'Schemes',
      component: <ProcessorSchemeDetails data={props.data} reFetch={() => props.reFetch()} modelName={props.modelName} />,
    },
  ];

  const handleClose = () => {
    setOpenModal(null);
  };

  const renderModal = () => {
    switch (openModal) {
      case 'basicInfo':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <FarmerPersonalDetailsEditor
              formData={{
                data: {
                  personalDetails: props.data?.personalDetails,
                  dob: props.data?.dob,
                  gender: props.data?.gender,
                },
              }}
              onSubmit={handleFormSubmit}
              onCancelBtnClick={handleClose}
            />
          </Dialog>
        );

      case 'idVerification':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <FarmerIdentityVerificationEditor
              formData={{
                data: {
                  identityDetails: props.data?.personalDetails.identityDetails,
                },
              }}
              onSubmit={handleIdentityDetailsSubmit}
              onCancelBtnClick={handleClose}
            />
          </Dialog>
        );

      case 'bankDetails':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <FarmerBankDetailsEditor
              formData={{
                data: {
                  bankDetails: props.data?.bankDetails,
                },
              }}
              onSubmit={handleFormSubmit}
              onCancelBtnClick={handleClose}
            />
          </Dialog>
        );

      case 'additionalDocuments':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <FarmerAdditionalDocumentsEditor
              formData={{
                data: {
                  documents: props.data?.documents,
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
        labels={componentData?.map((item, index) => {
          return { label: item.label };
        })}
        panels={componentData?.map((item: any, index: any) => {
          if (item?.component) {
            return item?.component;
          } else {
            return (
              <ProcessorDetailsBioCardContent
                data={item && item.data ? [...item.data] : []}
                title={item ? item.title : ''}
                key={index}
                onButtonClick={item ? item.onClick : undefined}
              />
            );
          }
        })}
      />
      {renderModal()}
    </>
  );
}
