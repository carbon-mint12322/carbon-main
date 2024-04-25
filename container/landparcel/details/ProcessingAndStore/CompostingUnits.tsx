import { GridValueGetterParams } from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import { INestedProps } from '~/frontendlib/dataModel';
const CompostingUnitsEditor = dynamic(
  import('~/gen/data-views/landparcel_compostingUnits/landparcel_compostingUnitsEditor.rtml'),
);

export default function CompostingUtils({ data, lpData, modelName, reFetch, lpMap }: INestedProps) {
  const childResourceUri = 'composting-units';
  const columnConfig = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.name}`,
    },
    {
      field: 'type',
      headerName: 'Unit Type',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.type}`,
    },
    {
      field: 'compostingType',
      headerName: 'Composting Type',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.compostingType ? params.row.compostingType : ''}`,
    },
    {
      field: 'size',
      headerName: 'Size (sqyd)',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.size}`,
    },
    {
      field: 'bedSize',
      headerName: 'Number of Beds',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${params.row.bedSize ? params.row.bedSize : ''}`,
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
      Editor={CompostingUnitsEditor}
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
