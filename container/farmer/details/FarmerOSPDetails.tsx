import React from 'react';
import dynamic from 'next/dynamic';
const Add_farmerospEditor = dynamic(
  import('~/gen/data-views/add_farmerosp/add_farmerospEditor.rtml'),
);
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import axios from 'axios';
import { useOperator } from '~/contexts/OperatorContext';

interface FarmerOSPDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function FarmerOSPDetails({ data, reFetch, modelName }: FarmerOSPDetailsProps) {

  const { getAPIPrefix } = useOperator();

  const childResourceUri = 'osps';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'year',
      headerName: 'Year',
      flex: 1,
    },
    {
      field: 'landParcel.name',
      headerName: 'Land Parcel',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.landParcel?.name,
    },
    {
      field: 'totalArea',
      headerName: 'Total Area',
      flex: 1,
    },
    {
      field: 'latitude',
      headerName: 'Latitude',
      flex: 1,
    },
    {
      field: 'longitude',
      headerName: 'Longitude',
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
      Editor={Add_farmerospEditor}
      data={data?.osps}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
