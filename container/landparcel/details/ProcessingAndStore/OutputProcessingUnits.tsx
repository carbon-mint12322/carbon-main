import { GridValueGetterParams } from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import { INestedProps } from '~/frontendlib/dataModel';
const OutputProcessingUnitsEditor = dynamic(
  import(
    '~/gen/data-views/landparcel_outputProcessingUnits/landparcel_outputProcessingUnitsEditor.rtml'
  ),
);

export default function OutputProcessingUnits({ data, lpData, modelName, reFetch, lpMap }: INestedProps) {
  const childResourceUri = 'output-processing-units';
  const columnConfig = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.name}`,
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.type}`,
    },
    {
      field: 'capacity',
      headerName: 'Capacity (Kgs/Litres)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.capacity}`,
    },
  ];
  const processingSystemFilter = {
    landParcel: lpData._id,
  };
  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'processingSystem': // this key is defined as ui:options in yaml
          return processingSystemFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };
  return (
    <NestedResourceListComponent
      Editor={OutputProcessingUnitsEditor}
      data={data}
      parentData={lpData}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
