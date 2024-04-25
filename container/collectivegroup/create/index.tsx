import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectivegroupEditor = dynamic(
  import('~/gen/data-views/add_collectivegroup/add_collectivegroupEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { CollectiveGroupFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveGroupFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function CollectiveGroupForm({ collective, handleSubmit, reFetch }: CollectiveGroupFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  // Add collective to data

  const handleFormSubmit = async (data: CollectiveGroupFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        collective: collective,
      };
      const res = await axios.post(getApiUrl('/collectivegroup'), newData);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added operator group');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new operator group');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectivegroupEditor onSubmit={handleFormSubmit} />
    </ModalCircularLoader>
  );
}

export default CollectiveGroupForm;
