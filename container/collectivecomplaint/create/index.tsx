import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectivecomplaintEditor = dynamic(
  import('~/gen/data-views/add_collectivecomplaint/add_collectivecomplaintEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { CollectiveComplaintFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveComplaintFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function CollectiveComplaintForm({
  collective,
  handleSubmit,
  reFetch,
}: CollectiveComplaintFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  // Add collective to data

  const handleFormSubmit = async (data: CollectiveComplaintFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        collective: collective,
      };
      const res = await axios.post(getApiUrl('/collectivecomplaint'), newData);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added operator complaint');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new operator complaint');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectivecomplaintEditor onSubmit={handleFormSubmit} />
    </ModalCircularLoader>
  );
}

export default CollectiveComplaintForm;
