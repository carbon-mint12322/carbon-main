import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectiveinspectionEditor = dynamic(
  import('~/gen/data-views/add_collectiveinspection/add_collectiveinspectionEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import {
  CollectiveInspectionFormData,
  LandParcel,
  CollectiveInspection,
} from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveInspectionEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function CollectiveInspectionEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly,
}: CollectiveInspectionEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: CollectiveInspectionFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      const res = await axios.post(getApiUrl(`/collectiveinspection/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated operator inspection details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update operator inspection details');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectiveinspectionEditor
        formData={{
          data: data,
        }}
        onSubmit={handleFormSubmit}
        readonly={readonly}
      />
    </ModalCircularLoader>
  );
}

export default CollectiveInspectionEditForm;
