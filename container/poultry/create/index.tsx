import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const PoultryEditor = dynamic(import('~/gen/data-views/add_poultry/add_poultryEditor.rtml'));

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { PoultryFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface PoultryFormProps {
  lpData: LandParcel;
  handleSubmit: () => void;
  reFetch?: () => void;
  handleClose: () => void;
}

function PoultryForm({ lpData, handleSubmit, reFetch, handleClose }: PoultryFormProps) {
  const router = useRouter();
  const landParcelId = router.query.id;
  const productionSystemFilter = {
    landParcel: landParcelId,
    category: 'Poultry',
  };
  const poultryPopFilter = {};
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: PoultryFormData) => {
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
            (lpData?.farmer?.personalDetails?.firstName || '') +
            (lpData?.farmer?.personalDetails?.lastName
              ? ' ' + lpData.farmer.personalDetails.lastName
              : ''),
        },
        status: 'Draft',
      };
      const res = await axios.post(getApiUrl('/poultry'), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added new poultry batch');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new poultry batch');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'productionSystem': // this key is defined as ui:options in yaml
          return productionSystemFilter;
        case 'poultrypop': // this key is defined as ui:options in yaml
          return poultryPopFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <PoultryEditor
        onSubmit={handleFormSubmit}
        formContext={formContext}
        onCancelBtnClick={handleClose}
      />
    </ModalCircularLoader>
  );
}

export default PoultryForm;
