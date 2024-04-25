import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_goatEditor = dynamic(import('~/gen/data-views/add_goat/add_goatEditor.rtml'));

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { GoatFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface GoatFormProps {
  lpData: LandParcel;
  handleSubmit: () => void;
  reFetch?: () => void;
  handleCancel?: () => void;
}

function GoatForm({ lpData, handleSubmit, reFetch, handleCancel }: GoatFormProps) {
  const router = useRouter();
  const landParcelId = router.query.id;

  const popFilter = {};
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl, getAPIPrefix } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: GoatFormData) => {
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
      console.log('Data saved to goat', data);
      const res = await axios.post(getApiUrl('/goat'), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added new goat');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new goat');
    } finally {
      setSubmit(false);
    }
  };

  async function productionSystemFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/productionsystem`);

    // Filter the data array based on the productionSystemId
    const filteredData = res.data.filter((productionsystem: any) => productionsystem.landParcel === lpData.id && productionsystem.category === 'Goats');

    return filteredData;
  }


  const formContext: any = {
    foreignObjectLoader: productionSystemFilter,
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_goatEditor
        onSubmit={handleFormSubmit}
        onCancelBtnClick={handleCancel}
        formContext={formContext}
      />
    </ModalCircularLoader>
  );
}

export default GoatForm;
