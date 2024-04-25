import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const PoultryControlPointEditor = dynamic(
  import('~/gen/data-views/add_poultrycontrolpoint/add_poultrycontrolpointEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { useRouter } from 'next/router';

interface PoultryControlPointEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  index?: number;
}

function PoultryControlPointEditForm({
  data,
  index,
  handleSubmit,
  reFetch,
}: PoultryControlPointEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (formData: any) => {
    try {
      setSubmit(true);

      const res = await axios.put(
        getApiUrl(`/poultrypop/${data?.popId}/controlpoint/${data?._id}`),
        formData.addCP,
      );

      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated controlpoint');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update controlpoint');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <PoultryControlPointEditor
        formData={{
          data: data,
        }}
        onSubmit={handleFormSubmit}
      />
    </ModalCircularLoader>
  );
}

export default PoultryControlPointEditForm;
