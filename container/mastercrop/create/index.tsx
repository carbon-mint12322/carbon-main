import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_mastercropEditor = dynamic(
  import('~/gen/data-views/add_mastercrop/add_mastercropEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { MasterCropFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface MasterCropFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function MasterCropForm({ collective, handleSubmit, reFetch }: MasterCropFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  // Add collective to data

  const handleFormSubmit = async (data: MasterCropFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        collective: collective,
      };
      const res = await axios.post(getApiUrl('/mastercrop'), newData);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added new master crop');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new master crop');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_mastercropEditor onSubmit={handleFormSubmit} />
    </ModalCircularLoader>
  );
}

export default MasterCropForm;
