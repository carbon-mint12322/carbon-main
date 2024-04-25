import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_aggregationplanEditor = dynamic(
  import('~/gen/data-views/add_aggregationplan/add_aggregationplanEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { AggregationPlanFormData, LandParcel, AggregationPlan } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface AggregationPlanEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function AggregationPlanEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly,
}: AggregationPlanEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const cbFilter = {};
  const huFilter = {};

  const handleFormSubmit = async (data: AggregationPlanFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      const res = await axios.post(getApiUrl(`/organicsystemplan/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated aggregation plan details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update aggregation plan details');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'certificationBody': // this key is defined as ui:options in yaml
          return cbFilter;
        case 'harvestUpdate': // this key is defined as ui:options in yaml
          return huFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };
  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_aggregationplanEditor
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

export default AggregationPlanEditForm;
