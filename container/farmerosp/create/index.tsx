import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_farmerospEditor = dynamic(
  import('~/gen/data-views/add_farmerosp/add_farmerospEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { FarmerOSPFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface FarmerOSPFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function FarmerOSPForm({ collective, handleSubmit, reFetch }: FarmerOSPFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const farmerId = router.query.id;

  // Add collective to data

  const handleFormSubmit = async (data: FarmerOSPFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        farmer: farmerId,
      };
      const res = await axios.post(getApiUrl('/farmerosp'), newData);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added farmer osp');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new farmer osp');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_farmerospEditor onSubmit={handleFormSubmit} />
    </ModalCircularLoader>
  );
}

export default FarmerOSPForm;
