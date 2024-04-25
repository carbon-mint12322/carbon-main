import React from 'react';
import dynamic from 'next/dynamic';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
const Add_collectiveinputpermissionEditor = dynamic(
  import('~/gen/data-views/add_collectiveinputpermission/add_collectiveinputpermissionEditor.rtml'),
);
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';

interface CollectiveInputPermissionDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveInputPermissionDetails({
  data,
  reFetch,
  modelName,
}: CollectiveInputPermissionDetailsProps) {
  const { getAPIPrefix } = useOperator();

  const childResourceUri = 'input-permission-details';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'applicationDate',
      headerName: 'Application Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        stringDateFormatter(params.row?.applicationDate),
    },
    {
      field: 'cb',
      headerName: 'Certification Body',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.cb?.name,
    },
    {
      field: 'assessorDate',
      headerName: 'Assessment Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.assessorDate),
    },
    {
      field: 'assessorName',
      headerName: 'Assessor Name',
      flex: 1,
    },
    {
      field: 'cbApproval',
      headerName: 'Approval Status',
      flex: 1,
    },
    {
      field: 'approvalDate',
      headerName: 'Approval Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.approvalDate),
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
      Editor={Add_collectiveinputpermissionEditor}
      data={data?.inputPermissionDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
