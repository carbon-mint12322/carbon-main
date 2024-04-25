import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectivengmotestrecordEditor = dynamic(
  import('~/gen/data-views/add_collectivengmotestrecord/add_collectivengmotestrecordEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import {
  CollectiveNGMOTestRecordFormData,
  LandParcel,
  CollectiveNGMOTestRecord,
} from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveNGMOTestRecordEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function CollectiveNGMOTestRecordEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly,
}: CollectiveNGMOTestRecordEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const cropFilter = {};
  const apFilter = {};

  const handleFormSubmit = async (data: CollectiveNGMOTestRecordFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      const res = await axios.post(getApiUrl(`/collectivengmotestrecord/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated operator ngmo test record details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update operator ngmo test record details');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'crop': // this key is defined as ui:options in yaml
          return cropFilter;
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
      <Add_collectivengmotestrecordEditor
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

export default CollectiveNGMOTestRecordEditForm;
