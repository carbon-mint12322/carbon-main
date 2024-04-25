import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectivesanctionEditor = dynamic(
  import('~/gen/data-views/add_collectivesanction/add_collectivesanctionEditor.rtml'),
);
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';

interface CollectiveSanctionDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveSanctionDetails({
  data,
  reFetch,
  modelName
}: CollectiveSanctionDetailsProps) {
  const { getAPIPrefix } = useOperator();

  const childResourceUri = 'sanction-details';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'sanctionDate',
      headerName: 'Sanction Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.sanctionDate),
    },
    {
      field: 'cb',
      headerName: 'Certification Body',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.cb?.name,
    },
    {
      field: 'sanctionType',
      headerName: 'Sanction Type',
      flex: 1,
    },
    {
      field: 'sanctionStatus',
      headerName: 'Status',
      flex: 1,
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
      Editor={Add_collectivesanctionEditor}
      data={data?.sanctionDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
