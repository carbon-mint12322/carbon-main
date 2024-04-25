import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_harvestupdateEditor = dynamic(
  import('~/gen/data-views/add_harvestupdate/add_harvestupdateEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { HarvestUpdateFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface HarvestUpdateFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function HarvestUpdateForm({ collective, handleSubmit, reFetch }: HarvestUpdateFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  // Add collective to data

  const handleFormSubmit = async (data: HarvestUpdateFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        collective: collective,
      };
      const res = await axios.post(getApiUrl('/harvestupdate'), newData);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added new harvest update');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new harvest update');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_harvestupdateEditor onSubmit={handleFormSubmit} />
    </ModalCircularLoader>
  );
}

export default HarvestUpdateForm;
