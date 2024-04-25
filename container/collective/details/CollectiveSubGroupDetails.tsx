import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectivesubgroupEditor = dynamic(
  import('~/gen/data-views/add_collectivesubgroup/add_collectivesubgroupEditor.rtml'),
);
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
import { useOperator } from '~/contexts/OperatorContext';
import { stringDateFormatter } from '~/utils/dateFormatter';

interface CollectiveSubGroupDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveSubGroupDetails({
  data,
  reFetch,
  modelName,
}: CollectiveSubGroupDetailsProps) {
  const { getApiUrl } = useOperator();

  const childResourceUri = 'sub-groups';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Subgroup Name',
      flex: 1,
    },
    // {
    //   field: 'description',
    //   headerName: 'Description',
    //   flex: 1,
    // },
    {
      field: 'group.name',
      headerName: 'Group Name',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => params.row?.group?.name,
    },
    {
      field: 'subGroupLeader',
      headerName: 'Subgroup Leader',
      flex: 1,
    },
    {
      field: 'subGroupContact',
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

  async function collectiveGroupFilter() {
    return data?.groups;
  }

  const formContext: any = {
    getApiUrl,
    foreignObjectLoader: collectiveGroupFilter,
  };

  return (
    <NestedResourceListComponent
      Editor={Add_collectivesubgroupEditor}
      data={data?.subGroups}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
      formContext={formContext}
    />
  );
}
