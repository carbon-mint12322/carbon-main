import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const AquaControlPointEditor = dynamic(
  import('~/gen/data-views/add_aquacontrolpoint/add_aquacontrolpointEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { useRouter } from 'next/router';

interface AquaControlPointEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  index?: number;
}

function AquaControlPointEditForm({
  data,
  index,
  handleSubmit,
  reFetch,
}: AquaControlPointEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();
  // TODO Need to fix this
  const handleFormSubmit = async (data: any) => {
    try {
      setSubmit(true);
      //delete data?._id;
      //const res = await axios.post(getApiUrl(`/aqua/${data?.id}/`), data);
      //if (res) {
      //  reFetch && reFetch();
      //  openToast('success', 'Successfully updated aqua batch details');
      //   handleSubmit();
      //}
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update aqua batch details');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <AquaControlPointEditor
        formData={{
          data: data.aquaControlPoints[index ? index : 0],
        }}
        onSubmit={handleFormSubmit}
      />
    </ModalCircularLoader>
  );
}

export default AquaControlPointEditForm;
