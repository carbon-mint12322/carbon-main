import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const AquaCropEditor = dynamic(import('~/gen/data-views/add_aquacrop/add_aquacropEditor.rtml'));

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { AquaCropFormData, LandParcel, AquaCrop } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface AquaCropEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function AquaCropEditForm({ data, handleSubmit, reFetch, readonly }: AquaCropEditFormProps) {
  const landParcelId = data?.landParcel?.id;
  const productionSystemFilter = {
    landParcel: landParcelId,
  };
  const popFilter = {};
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: AquaCropFormData) => {
    try {
      setSubmit(true);
      delete data?._id;
      const res = await axios.post(getApiUrl(`/aquacrop/${data?.id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated aquaculture crop details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update aquaculture crop details');
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
          return popFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <AquaCropEditor
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

export default AquaCropEditForm;
