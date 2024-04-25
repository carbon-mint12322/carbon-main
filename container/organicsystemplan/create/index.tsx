import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_organicSystemPlanEditor = dynamic(
  import('~/gen/data-views/organicSystemPlan/organicSystemPlanEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { OrganicSystemPlanFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface OrganicSystemPlanFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function OrganicSystemPlanForm({ collective, handleSubmit, reFetch }: OrganicSystemPlanFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  // Add collective to data

  const handleFormSubmit = async (data: OrganicSystemPlanFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        collective: collective,
      };
      const res = await axios.post(getApiUrl('/organicsystemplan'), newData);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added new organic system plan');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new organic system plan');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_organicSystemPlanEditor onSubmit={handleFormSubmit} />
    </ModalCircularLoader>
  );
}

export default OrganicSystemPlanForm;
