import React from 'react';
import dynamic from 'next/dynamic';
const Add_collectivecomplaintEditor = dynamic(
  import('~/gen/data-views/add_collectivecomplaint/add_collectivecomplaintEditor.rtml'),
);
import { stringDateFormatter } from '~/utils/dateFormatter';
import { GridValueGetterParams } from '@mui/x-data-grid';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';

interface CollectiveComplaintDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveComplaintDetails({
  data,
  reFetch,
  modelName
}: CollectiveComplaintDetailsProps) {
  const childResourceUri = 'compliant-details';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'complaintDate',
      headerName: 'Complaint Date',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => stringDateFormatter(params.row?.complaintDate),
    },
    {
      field: 'complaintName',
      headerName: 'Complaint Name',
      flex: 1,
    },
    {
      field: 'contact',
      headerName: 'Contact',
      flex: 1,
    },
    {
      field: 'assignedTo',
      headerName: 'Assigned To',
      flex: 1,
    },
    {
      field: 'priorityLevel',
      headerName: 'Priority Level',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={Add_collectivecomplaintEditor}
      data={data?.compliantDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
    />
  );
}
