import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_plotEditor = dynamic(import('~/gen/data-views/add_plot/add_plotEditor.rtml'));

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { PlotFormData, LandParcel, Plot } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface PlotEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
  formContext?: any;
}

function PlotEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly = false,
  formContext,
}: PlotEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: PlotFormData) => {
    try {
      setSubmit(true);
      const p_id = data?.id;
      delete data?._id;
      console.log('Updated data', data);
      const res = await axios.post(getApiUrl(`/plot/${p_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated plot details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update plot details');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_plotEditor
        formData={{
          data: data,
        }}
        onSubmit={handleFormSubmit}
        readonly={readonly}
        formContext={formContext}
      />
    </ModalCircularLoader>
  );
}

export default PlotEditForm;
