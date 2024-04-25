import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const CowEditor = dynamic(import('~/gen/data-views/add_cow/add_cowEditor.rtml'));

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { CowFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CowFormProps {
  lpData: LandParcel;
  handleSubmit: () => void;
  reFetch?: () => void;
  handleCancel?: () => void;
}

function CowForm({ lpData, handleSubmit, reFetch, handleCancel }: CowFormProps) {
  const router = useRouter();
  const landParcelId = router.query.id;

  const popFilter = {};
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl, getAPIPrefix } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: CowFormData) => {
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
              lpData?.farmer?.personalDetails.lastName ? lpData?.farmer?.personalDetails.lastName : '',
        },
        status: 'Draft',
      };
      console.log('Data saved to cow', data);
      const res = await axios.post(getApiUrl('/cow'), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added a new cow');
        console.log('Successfully added ', data);
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add a new cow');
    } finally {
      setSubmit(false);
    }
  };

  async function productionSystemFilter() {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `/productionsystem`);

    // Filter the data array based on the productionSystemId
    const filteredData = res.data.filter((productionsystem: any) => productionsystem.landParcel === lpData.id && productionsystem.category === 'Dairy');

    return filteredData;
  }


  const formContext: any = {
    foreignObjectLoader: productionSystemFilter,
  };


  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <CowEditor
        onSubmit={handleFormSubmit}
        onCancelBtnClick={handleCancel}
        formContext={formContext}
      />
    </ModalCircularLoader>
  );
}

export default CowForm;
