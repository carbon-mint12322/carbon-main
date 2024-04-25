import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectivevalidationEditor = dynamic(
  import('~/gen/data-views/add_collectivevalidation/add_collectivevalidationEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import {
  CollectiveValidationFormData,
  LandParcel,
  CollectiveValidation,
} from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveValidationEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function CollectiveValidationEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly,
}: CollectiveValidationEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: CollectiveValidationFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      const res = await axios.post(getApiUrl(`/collectivevalidation/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated operator validation details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update operator validation details');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectivevalidationEditor
        formData={{
          data: data,
        }}
        onSubmit={handleFormSubmit}
        readonly={readonly}
      />
    </ModalCircularLoader>
  );
}

export default CollectiveValidationEditForm;
