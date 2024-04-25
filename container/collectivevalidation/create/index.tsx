import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectivevalidationEditor = dynamic(
  import('~/gen/data-views/add_collectivevalidation/add_collectivevalidationEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { CollectiveValidationFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveValidationFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function CollectiveValidationForm({
  collective,
  handleSubmit,
  reFetch,
}: CollectiveValidationFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  // Add collective to data

  const handleFormSubmit = async (data: CollectiveValidationFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        collective: collective,
      };
      const res = await axios.post(getApiUrl('/collectivevalidation'), newData);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added operator validation');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new operator validation');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectivevalidationEditor onSubmit={handleFormSubmit} />
    </ModalCircularLoader>
  );
}

export default CollectiveValidationForm;
