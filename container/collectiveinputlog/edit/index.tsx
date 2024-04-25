import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectiveinputlogEditor = dynamic(
  import('~/gen/data-views/add_collectiveinputlog/add_collectiveinputlogEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import {
  CollectiveInputLogFormData,
  LandParcel,
  CollectiveInputLog,
} from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveInputLogEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function CollectiveInputLogEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly,
}: CollectiveInputLogEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const cbFilter = {};
  const apFilter = {};

  const handleFormSubmit = async (data: CollectiveInputLogFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      const res = await axios.post(getApiUrl(`/collectiveinputlog/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated operator input log details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update operator inpu log details');
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
      <Add_collectiveinputlogEditor
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

export default CollectiveInputLogEditForm;
