import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const AquaCropEditor = dynamic(import('~/gen/data-views/add_aquacrop/add_aquacropEditor.rtml'));

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { AquaCropFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface AquaCropFormProps {
  lpData: LandParcel;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function AquaCropForm({ lpData, handleSubmit, reFetch }: AquaCropFormProps) {
  const router = useRouter();
  const landParcelId = router.query.id;
  const productionSystemFilter = {
    landParcel: landParcelId,
    category: 'Aquaculture',
  };
  const aquaPopFilter = {};
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: AquaCropFormData) => {
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
      console.log('Data saved to aquaculture crop', data);
      const res = await axios.post(getApiUrl('/aquacrop'), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added new aquaculture crop');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new aquaculture crop');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'productionSystem': // this key is defined as ui:options in yaml
          return productionSystemFilter;
        case 'aquapop': // this key is defined as ui:options in yaml
          return aquaPopFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <AquaCropEditor onSubmit={handleFormSubmit} formContext={formContext} />
    </ModalCircularLoader>
  );
}

export default AquaCropForm;
