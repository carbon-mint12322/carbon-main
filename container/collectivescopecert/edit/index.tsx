import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectivescopecertEditor = dynamic(
  import('~/gen/data-views/add_collectivescopecert/add_collectivescopecertEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import {
  CollectiveScopeCertFormData,
  LandParcel,
  CollectiveScopeCert,
} from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveScopeCertEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function CollectiveScopeCertEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly,
}: CollectiveScopeCertEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const cbFilter = {};

  const handleFormSubmit = async (data: CollectiveScopeCertFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      const res = await axios.post(getApiUrl(`/collectivescopecert/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated operator scope certificat details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update operator scope certificate details');
    } finally {
      setSubmit(false);
    }
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'certificationBody': // this key is defined as ui:options in yaml
          return cbFilter;

        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectivescopecertEditor
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

export default CollectiveScopeCertEditForm;
