import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ProcessorPersonalDetails } from '~/frontendlib/dataModel';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';
import ProcessorDetailsBioCardContent from './ProcessorDetailsBioCardContent';

import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import Dialog from '~/components/lib/Feedback/Dialog';

import ProcessorInspectionDetails from '~/container/processor/details/ProcessorInspectionDetails';
import UploadFileDialog from '~/components/UploadFileDialog';
import { PropaneSharp } from '@mui/icons-material';

const FarmerOrgDetailsEditor = dynamic(
  import('~/gen/data-views/farmerOrgDetails/farmerOrgDetailsEditor.rtml'),
);

export default function OperatorDetailsBioVerticalTabs(props: any) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const { getAPIPrefix, operator } = useOperator();

  const handleFormSubmit = async (formData: any) => {
    props.handleFormSubmit(formData);
    setOpenModal(null);
  };

  const handleIdentityDetailsSubmit = async (formData: any) => {
    props.handleIdentityDetailsSubmit(formData);
    setOpenModal(null);
  };

  const orgDetails = [
    {
      title: 'Processor ID',
      subText: props.data?.operatorDetails?.processorID || props.data?.fbId,
    },
    {
      title: 'Joining Date',
      subText: props.data?.operatorDetails?.joiningDate,
    },
    {
      subText: 'Operator Registration Document',
      url: props.data?.operatorDetails?.identityDocument,
    },
    {
      title: 'Processor Subgroup',
      subText: props.data?.operatorDetails?.subgroup?.name,
    },
  ];

  const componentData = [
    {
      label: 'Operator Details',
      data: orgDetails,
      title: 'Operator Details',
      onClick: () => setOpenModal('organizationDetails'),
    },
    {
      label: 'Internal Inspections',
      count: props.data?.processorinspections?.length || 0,
      title: 'Internal Inspections',
      component: <ProcessorInspectionDetails data={props.data} reFetch={() => props.reFetch()} modelName={props.modelName} />,
    },
  ];

  const handleClose = () => {
    setOpenModal(null);
  };

  async function defaultListFilter(options: any) {
    if (options?.uiOptions.filterKey === 'subgroup') {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/collective/${operator?._id.toString()}`);
      return res.data?.subGroups;
    } else {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `${options.schemaId}`);
      return res.data;
    }
  }

  const formContext: any = {
    foreignObjectLoader: defaultListFilter,
  };

  const renderModal = () => {
    switch (openModal) {
      case 'organizationDetails':
        return (
          <Dialog open={Boolean(openModal)} onClose={handleClose} fullWidth maxWidth={'md'}>
            <FarmerOrgDetailsEditor
              formData={{
                data: {
                  operatorDetails: props.data?.operatorDetails,
                },
              }}
              onSubmit={handleFormSubmit}
              onCancelBtnClick={handleClose}
              formContext={formContext}
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
