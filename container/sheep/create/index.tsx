import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const SheepEditor = dynamic(import('~/gen/data-views/add_sheep/add_sheepEditor.rtml'));

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { SheepFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface SheepFormProps {
  lpData: LandParcel;
  handleSubmit: () => void;
  reFetch?: () => void;
  handleCancel?: () => void;
}

function SheepForm({ lpData, handleSubmit, reFetch, handleCancel }: SheepFormProps) {
  const router = useRouter();
  const landParcelId = router.query.id;

  const popFilter = {};
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl, getAPIPrefix } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: SheepFormData) => {
    try {
      setSubmit(true);
      data = {
        ...data,
        landParcel: {
          id: lpData?._id,
          name: lpData?.name,
        },
        farmer: {
          id: lpData?.farmer?.id,
          name:
            lpData?.farmer?.personalDetails.firstName +
            ' ' +
            lpData?.farmer?.personalDetails.lastName,
        },
        status: 'Draft',
      };
      console.log('Data saved to sheep', data);
      const res = await axios.post(getApiUrl('/sheep'), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added new sheep');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new sheep');
    } finally {
      setSubmit(false);
    }
  };


  async function productionSystemFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/productionsystem`);

    // Filter the data array based on the productionSystemId
    const filteredData = res.data.filter((productionsystem: any) => productionsystem.landParcel === lpData.id && productionsystem.category === 'Sheep');

    return filteredData;
  }


  const formContext: any = {
    foreignObjectLoader: productionSystemFilter,
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <SheepEditor
        onSubmit={handleFormSubmit}
        onCancelBtnClick={handleCancel}
        formContext={formContext}
      />
    </ModalCircularLoader>
  );
}

export default SheepForm;
