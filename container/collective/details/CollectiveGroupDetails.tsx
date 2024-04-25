import React from 'react';
import dynamic from 'next/dynamic';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const Add_collectivegroupEditor = dynamic(
  import('~/gen/data-views/add_collectivegroup/add_collectivegroupEditor.rtml'),
);
import { GridValueGetterParams } from '@mui/x-data-grid';
import { stringDateFormatter } from '~/utils/dateFormatter';

interface CollectiveGroupDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveGroupDetails({ data, reFetch, modelName }: CollectiveGroupDetailsProps) {

  const childResourceUri = 'groups';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Group Name',
      flex: 1,
    },
    // {
    //   field: 'description',
    //   headerName: 'Description',
    //   flex: 1,
    // },
    {
      field: 'groupLeader',
      headerName: 'Group Leader',
      flex: 1,
    },
    {
      field: 'groupContact',
      headerName: 'Contact',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'creationDate',
      headerName: 'Creation Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.creationDate),
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={Add_collectivegroupEditor}
      data={data?.groups}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
    />
  );
}
