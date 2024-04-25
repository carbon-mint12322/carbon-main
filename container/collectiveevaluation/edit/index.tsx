import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectiveevaluationEditor = dynamic(
  import('~/gen/data-views/add_collectiveevaluation/add_collectiveevaluationEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import {
  CollectiveEvaluationFormData,
  LandParcel,
  CollectiveEvaluation,
} from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveEvaluationEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function CollectiveEvaluationEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly,
}: CollectiveEvaluationEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: CollectiveEvaluationFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      const res = await axios.post(getApiUrl(`/collectiveevaluation/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated operator evaluation details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update operator evaluation details');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectiveevaluationEditor
        formData={{
          data: data,
        }}
        onSubmit={handleFormSubmit}
        readonly={readonly}
      />
    </ModalCircularLoader>
  );
}

export default CollectiveEvaluationEditForm;
