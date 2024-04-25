import React from 'react';
import dynamic from 'next/dynamic';
const Add_farmerschemeEditor = dynamic(
  import('~/gen/data-views/add_farmerscheme/add_farmerschemeEditor.rtml'),
);
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import axios from 'axios';
import { stringDateFormatter } from '~/utils/dateFormatter';

import { useOperator } from '~/contexts/OperatorContext';

interface FarmerSchemeDetailsProps {
  data: any;
  modelName: string;
  reFetch: () => void;
}

export default function FarmerSchemeDetails({ data, reFetch, modelName }: FarmerSchemeDetailsProps) {
  const { getAPIPrefix } = useOperator();

  const childResourceUri = 'schemes';

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
    if (options?.uiOptions.filterKey === 'landParcel') {
      return data?.landParcels;
    } else {
      const res: {
        data: any;
      } = await axios.get(getAPIPrefix() + `${options.schemaId}`);
      return res.data;
    }
  }

  const formContext: any = {
    foreignObjectLoader: defaultListFilter,
  };

  return (
    <NestedResourceListComponent
      Editor={Add_farmerschemeEditor}
      data={data?.schemes}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
