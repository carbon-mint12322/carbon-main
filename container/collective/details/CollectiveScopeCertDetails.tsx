import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectivescopecertEditor = dynamic(
  import('~/gen/data-views/add_collectivescopecert/add_collectivescopecertEditor.rtml'),
);
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';

interface CollectiveScopeCertDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveScopeCertDetails({
  data,
  reFetch,
  modelName
}: CollectiveScopeCertDetailsProps) {
  const { getAPIPrefix } = useOperator();

  const childResourceUri = 'scope-certification-details';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'issuedDate',
      headerName: 'Issued Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.issuedDate),
    },
    {
      field: 'cb',
      headerName: 'Certification Body',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.cb?.name,
    },
    {
      field: 'scheme',
      headerName: 'Scheme',
      flex: 1,
    },
    {
      field: 'conversionStatus',
      headerName: 'Conversion Status',
      flex: 1,
    },
    {
      field: 'effectiveDate',
      headerName: 'Effective Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.effectiveDate),
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.expiryDate),
    },
  ];

  async function defaultListFilter(options: any) {
    const res: {
      data: any;
    } = await axios.get(getAPIPrefix() + `${options.schemaId}`);
    return res.data;
  }

  const formContext: any = {
    foreignObjectLoader: defaultListFilter,
  };

  return (
    <NestedResourceListComponent
      Editor={Add_collectivescopecertEditor}
      data={data?.scopeCertificationDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
