import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectivesamplingEditor = dynamic(
  import('~/gen/data-views/add_collectivesampling/add_collectivesamplingEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import {
  CollectiveSamplingFormData,
  LandParcel,
  CollectiveSampling,
} from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveSamplingEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function CollectiveSamplingEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly,
}: CollectiveSamplingEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const cbFilter = {};
  const apFilter = {};

  const handleFormSubmit = async (data: CollectiveSamplingFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      const res = await axios.post(getApiUrl(`/collectivesampling/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated operator sampling details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update operator sampling details');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'certificationBody': // this key is defined as ui:options in yaml
          return cbFilter;
        case 'aggregationPlan': // this key is defined as ui:options in yaml
          return apFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectivesamplingEditor
        formData={{
          data: data,
        }}
        onSubmit={handleFormSubmit}
        readonly={readonly}
        formContext={formContext}
      />
    </ModalCircularLoader>
  );
}

export default CollectiveSamplingEditForm;
