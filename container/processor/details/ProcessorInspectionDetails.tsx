import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
const Add_farmerinspectionEditor = dynamic(
  import('~/gen/data-views/add_farmerinspection/add_farmerinspectionEditor.rtml'),
);
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';

interface ProcessorInspectionDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function ProcessorInspectionDetails({
  data,
  reFetch,
  modelName
}: ProcessorInspectionDetailsProps) {
  const { getAPIPrefix } = useOperator();

  const childResourceUri = 'inspection-details';

  const columnConfig = [
    {
      field: 'year',
      headerName: 'Inspection Year',
      flex: 1,
    },
    {
      field: 'inspectionNo',
      headerName: 'Inspection Number',
      flex: 1,
    },
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },

    {
      field: 'landParcel',
      headerName: 'Land Parcel',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.landParcel?.name,
    },
    {
      field: 'inspectionDate',
      headerName: 'Inspection Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        stringDateFormatter(params.row?.inspectionDate),
    },
    {
      field: 'inspector',
      headerName: 'Internal Inspector',
      flex: 1,
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
      Editor={Add_farmerinspectionEditor}
      data={data?.inspectionDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
