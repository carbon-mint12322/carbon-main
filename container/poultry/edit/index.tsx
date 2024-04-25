import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const PoultryEditor = dynamic(import('~/gen/data-views/poultrybatch/poultrybatchEditor.rtml'));

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { PoultryFormData, LandParcel, Poultry } from '~/frontendlib/dataModel';

interface PoultryEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function PoultryEditForm({ data, handleSubmit, reFetch, readonly }: PoultryEditFormProps) {
  const landParcelId = data?.landParcel?.id;
  const productionSystemFilter = {
    landParcel: landParcelId,
  };
  const popFilter = {};
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: PoultryFormData) => {
    try {
      setSubmit(true);
      delete data?._id;
      const res = await axios.post(getApiUrl(`/poultrybatch/${data?.id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated poultry batch details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update poultry batch details');
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
          return popFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <PoultryEditor
        formData={{
          data: data,
        }}
        onSubmit={handleFormSubmit}
        formContext={formContext}
        readonly={readonly}
      />
    </ModalCircularLoader>
  );
}

export default PoultryEditForm;
