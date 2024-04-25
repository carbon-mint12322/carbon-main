import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectivetransactioncertEditor = dynamic(
  import('~/gen/data-views/add_collectivetransactioncert/add_collectivetransactioncertEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import {
  CollectiveTransactionCertFormData,
  LandParcel,
  CollectiveTransactionCert,
} from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveTransactionCertEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function CollectiveTransactionCertEditForm({
  data,
  handleSubmit,
  reFetch,
  readonly,
}: CollectiveTransactionCertEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: CollectiveTransactionCertFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      const res = await axios.post(getApiUrl(`/transactioncertificate/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated operator transaction certificate details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast(
        'error',
        error?.message || 'Failed to update operator transaction certificate details',
      );
    } finally {
      setSubmit(false);
    }
  };

  async function refFilter(options: any) {
    if (options?.uiOptions.filterKey === 'ngmoRecords') {
      return data?.ngmoTestRecords;
    } else if (options?.uiOptions.filterKey === 'aggregationPlan') {
      return data?.aggregationPlanDetails;
    } else {
      const res: {
        data: any;
      } = await axios.get(`/api/${options.schemaId}`);

      return res.data;
    }
  }

  const formContext: any = {
    getApiUrl,
    foreignObjectLoader: refFilter,
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectivetransactioncertEditor
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

export default CollectiveTransactionCertEditForm;
