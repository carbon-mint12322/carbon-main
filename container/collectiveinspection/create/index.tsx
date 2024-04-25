import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectiveinspectionEditor = dynamic(
  import('~/gen/data-views/add_collectiveinspection/add_collectiveinspectionEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { CollectiveInspectionFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveInspectionFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function CollectiveInspectionForm({
  collective,
  handleSubmit,
  reFetch,
}: CollectiveInspectionFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  // Add collective to data

  const handleFormSubmit = async (data: CollectiveInspectionFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        collective: collective,
      };
      const res = await axios.post(getApiUrl('/collectiveinspection'), newData);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added operator inspection');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new operator inspection');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectiveinspectionEditor onSubmit={handleFormSubmit} />
    </ModalCircularLoader>
  );
}

export default CollectiveInspectionForm;
