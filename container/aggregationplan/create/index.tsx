import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_aggregationplanEditor = dynamic(
  import('~/gen/data-views/add_aggregationplan/add_aggregationplanEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { AggregationPlanFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface AggregationPlanFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function AggregationPlanForm({ collective, handleSubmit, reFetch }: AggregationPlanFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const cbFilter = {};
  const huFilter = {};

  // Add collective to data

  const handleFormSubmit = async (data: AggregationPlanFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        collective: collective,
      };
      const res = await axios.post(getApiUrl('/aggregationplan'), newData);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added new aggregation plan');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new aggregation plan');
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
      <Add_aggregationplanEditor onSubmit={handleFormSubmit} formContext={formContext} />
    </ModalCircularLoader>
  );
}

export default AggregationPlanForm;
