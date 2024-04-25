import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectivegroupEditor = dynamic(
  import('~/gen/data-views/add_collectivegroup/add_collectivegroupEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { CollectiveGroupFormData, LandParcel, CollectiveGroup } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveGroupEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function CollectiveGroupEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly,
}: CollectiveGroupEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: CollectiveGroupFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      const res = await axios.post(getApiUrl(`/collectivegroup/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated operator group details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update operator group details');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectivegroupEditor
        formData={{
          data: data,
        }}
        onSubmit={handleFormSubmit}
        readonly={readonly}
      />
    </ModalCircularLoader>
  );
}

export default CollectiveGroupEditForm;
