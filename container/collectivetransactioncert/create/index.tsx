import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_collectivetransactioncertEditor = dynamic(
  import('~/gen/data-views/add_collectivetransactioncert/add_collectivetransactioncertEditor.rtml'),
);

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { CollectiveTransactionCertFormData, LandParcel } from '~/frontendlib/dataModel';
import { useRouter } from 'next/router';

interface CollectiveTransactionCertFormProps {
  collective: string;
  handleSubmit: () => void;
  reFetch?: () => void;
}

function CollectiveTransactionCertForm({
  collective,
  handleSubmit,
  reFetch,
}: CollectiveTransactionCertFormProps) {
  const router = useRouter();

  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { getAPIPrefix } = useOperator();
  const { openToast } = useAlert();

  const cbFilter = {};
  const apFilter = {};
  const ngmoTestRecordFilter = {};

  // Add collective to data

  const handleFormSubmit = async (data: CollectiveTransactionCertFormData) => {
    try {
      setSubmit(true);
      const newData = {
        ...data,
        collective: collective,
      };
      const res = await axios.post(getApiUrl('/transactioncertificate'), {
        ...newData,
        status: 'Draft',
      });

      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully added operator transaction certificate');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to add new operator transaction certificate');
    } finally {
      setSubmit(false);
    }
  };

  async function refFilter(options: any) {
    if (options?.uiOptions.filterKey === 'collectiveNGMOTestRecord') {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/collectivengmotestrecord`);
      return res.data;
    } else if (options?.uiOptions.filterKey === 'aggregationPlan') {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/aggregationplan`);

      return res.data;
    } else {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `/certificationbody`);

      return res.data;
    }
  }

  const formContext: any = {
    getApiUrl,
    foreignObjectLoader: refFilter,
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <Add_collectivetransactioncertEditor onSubmit={handleFormSubmit} formContext={formContext} />
    </ModalCircularLoader>
  );
}

export default CollectiveTransactionCertForm;
