import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_farmerinspectionEditor = dynamic(
  import('~/gen/data-views/add_farmerinspection/add_farmerinspectionEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { FarmerInspectionFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface FarmerInspectionFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function FarmerInspectionForm({ collective, handleSubmit, reFetch }: FarmerInspectionFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const farmerId = router.query.id;

  // Add collective to data

  const handleFormSubmit = async (data: FarmerInspectionFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        farmer: farmerId,
      };
      const res = await axios.post(getApiUrl('/farmerinspection'), newData);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added farmer inspection');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new farmer inspection');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_farmerinspectionEditor onSubmit={handleFormSubmit} />
    </ModalCircularLoader>
  );
}

export default FarmerInspectionForm;
