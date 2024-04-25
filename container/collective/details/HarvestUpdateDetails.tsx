import React from 'react';
import dynamic from 'next/dynamic';
import { getCapitalizeDashedWord } from '~/backendlib/util/getCapitalizedDashed';
const Add_harvestupdateEditor = dynamic(
  import('~/gen/data-views/add_harvestupdate/add_harvestupdateEditor.rtml'),
);

import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
interface HarvestUpdateDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function HarvestUpdateDetails({ data, reFetch, modelName }: HarvestUpdateDetailsProps) {

  const childResourceUri = 'harvest-update-details';

  const camelcasedChildResourceUri = getCapitalizeDashedWord(childResourceUri as any);

  function transformErrors(formData: any, errors: any) {
    const currentDate = new Date();
    const startDate = new Date(formData[camelcasedChildResourceUri].startDate).getTime()
    const endDate = new Date(formData[camelcasedChildResourceUri].endDate).getTime()
    if (startDate > currentDate.getTime()) {
      errors.push({
        stack: '"Start Date" should be less than current date',
      });
    }
    if (endDate > currentDate.getTime()) {
      errors.push({
        stack: '"End Date" should be less than current date',
      });
    }
    if (endDate < startDate) {
      errors.push({
        stack: '"End Date" must not be less than "Start Date"',
      });
    }
    return errors;
  }

  const columnConfig = [
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.startDate),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.endDate),
    },
    {
      field: 'ospYear',
      headerName: 'OSP Year',
      flex: 1,
    },
    {
      field: 'otherRemarks',
      headerName: 'Remarks',
      flex: 1,
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={Add_harvestupdateEditor}
      data={data?.harvestUpdateDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      transformErrors={transformErrors}
    />
  );
}
