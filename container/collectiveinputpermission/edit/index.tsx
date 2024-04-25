import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectiveinputpermissionEditor = dynamic(
  import('~/gen/data-views/add_collectiveinputpermission/add_collectiveinputpermissionEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import {
  CollectiveInputPermissionFormData,
  LandParcel,
  CollectiveInputPermission,
} from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveInputPermissionEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function CollectiveInputPermissionEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly,
}: CollectiveInputPermissionEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const cbFilter = {};
  const apFilter = {};

  const handleFormSubmit = async (data: CollectiveInputPermissionFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      const res = await axios.post(getApiUrl(`/collectiveinputpermission/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated operator input permission details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update operator inpu permission details');
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
      <Add_collectiveinputpermissionEditor
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

export default CollectiveInputPermissionEditForm;
