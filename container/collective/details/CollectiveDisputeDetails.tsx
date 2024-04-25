import React from 'react';
import dynamic from 'next/dynamic';
import NestedResourceListComponent from '~/components/lib/NestedResources/NestedResourceListComponent';
const Add_collectivedisputeEditor = dynamic(
  import('~/gen/data-views/add_collectivedispute/add_collectivedisputeEditor.rtml'),
);

interface CollectiveDisputeDetailsProps {
  data: any;
  reFetch: () => void;
  modelName: string;
}

export default function CollectiveDisputeDetails({ data, reFetch, modelName }: CollectiveDisputeDetailsProps) {

  const childResourceUri = 'dispute-details';

  const columnConfig = [
    {
      field: 'fbId',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'disputeDate',
      headerName: 'Dispute Date',
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
    {
      field: 'disputeParties',
      headerName: 'Dispute Parties',
      flex: 1,
    },
  ];

  return (
    <NestedResourceListComponent
      Editor={Add_collectivedisputeEditor}
      data={data?.disputeDetails}
      parentData={data}
      reFetch={reFetch}
      modelName={modelName}
      childResourceUri={childResourceUri}
      columnConfig={columnConfig}
    />
  );
}
