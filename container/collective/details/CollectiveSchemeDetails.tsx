import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectiveschemeEditor = dynamic(
  import('~/gen/data-views/add_collectivescheme/add_collectiveschemeEditor.rtml'),
);
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import { useOperator } from '~/contexts/OperatorContext';
import axios from 'axios';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';

interface CollectiveSchemeDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveSchemeDetails({ data, reFetch, modelName }: CollectiveSchemeDetailsProps) {
  const childResourceUri = 'scheme-details';
  const { getAPIPrefix } = useOperator();

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'certificationBodyId',
      headerName: 'Certification Body',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.certificationBodyId?.name,
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
      field: 'certificationStatus',
      headerName: 'Certification Status',
      flex: 1,
    },
    {
      field: 'validityStartDate',
      headerName: 'Validity Start Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        params.row?.validityStartDate ? stringDateFormatter(params.row?.validityStartDate) : '',
    },
    {
      field: 'validityEndDate',
      headerName: 'Validity End Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        params.row?.validityEndDate ? stringDateFormatter(params.row?.validityEndDate) : '',
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
      Editor={Add_collectiveschemeEditor}
      data={data?.schemeDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
