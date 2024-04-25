import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectivengmotestrecordEditor = dynamic(
  import('~/gen/data-views/add_collectivengmotestrecord/add_collectivengmotestrecordEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { CollectiveNGMOTestRecordFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveNGMOTestRecordFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function CollectiveNGMOTestRecordForm({
  collective,
  handleSubmit,
  reFetch,
}: CollectiveNGMOTestRecordFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();
  const cropFilter = {};
  const apFilter = {};

  // Add collective to data

  const handleFormSubmit = async (data: CollectiveNGMOTestRecordFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        collective: collective,
      };
      const res = await axios.post(getApiUrl('/collectivengmotestrecord'), newData);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added operator ngmo test record');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new operator ngmo test record');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      console.log('key', key);
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
      <Add_collectivengmotestrecordEditor onSubmit={handleFormSubmit} formContext={formContext} />
    </ModalCircularLoader>
  );
}

export default CollectiveNGMOTestRecordForm;
