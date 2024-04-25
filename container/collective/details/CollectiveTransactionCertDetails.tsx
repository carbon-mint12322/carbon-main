import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
import ListActionModal from '~/components/lib/ListActionModal';
import { Box, Paper, Typography } from '@mui/material';
import CollectiveTransactionCertForm from '~/container/collectivetransactioncert/create';
import CollectiveTransactionCertEditForm from '~/container/collectivetransactioncert/edit';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { useOperator } from '~/contexts/OperatorContext';
import { useRouter } from 'next/router';
import {
  GridRowParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';

interface CollectiveTransactionCertDetailsProps {
  data: any;
  reFetch: () => void;
}

export default function CollectiveTransactionCertDetails({
  data,
  reFetch,
}: CollectiveTransactionCertDetailsProps) {
  const { changeRoute, setOperator } = useOperator();
  const router = useRouter();

  const aggregationPlanDetails = data?.aggregationPlanDetails;
  const ngmoTestRecords = data?.ngmoTestRecords;

  const handleRowClick = (params: GridRowParams) => {
    changeRoute(
      `/collective/${data?._id.toString()}/transactioncertificate/${params?.row?.id}`,
    );
  };

  const handleAdd = () => {
    setOperator(data);
    router.push(
      `/private/farmbook/${data?.slug
      }/collective/${data?._id.toString()}/transactioncertificate/create`,
    );
  };

  const handleActivation = () => {
    reFetch && reFetch();
  };

  const styles = {
    renderActionCell: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '14px',
      padding: '8px 0px',
    },
  };

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row._id}
          schema={'transactioncertificates'}
          data={{
            ...data.row,
            aggregationPlanDetails,
            ngmoTestRecords,
          }}
          reFetch={reFetch}
          Editor={CollectiveTransactionCertEditForm}
          canActivate={false}
          canEdit={true}
          canDelete={true}
        />
      </Box>
    );
  };
  return (
    <>
      <TableView
        getRowId={(item) => item?.fbId}
        name={`Transaction Certificates`}
        columnConfig={[
          {
            field: 'fbId',
            headerName: 'ID',
            flex: 1,
          },
          {
            field: 'issuedDate',
            headerName: 'Issued Date',
            flex: 1,
            renderCell: (params: GridValueGetterParams) =>
              stringDateFormatter(params.row?.issuedDate),
          },

          {
            field: 'aggregationPlan',
            headerName: 'Aggregation Plan',
            flex: 1,
            renderCell: (params: GridValueGetterParams) => params.row?.aggregationPlan?.name,
          },

          {
            field: 'cb',
            headerName: 'Certification Body',
            flex: 1,
            renderCell: (params: GridValueGetterParams) => params.row?.cb.name,
          },
          {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 100,
            flex: 1,
            renderCell: renderActionCell,
          },
        ]}
        key={'collectiveTransactionCert-list'}
        data={data?.transactioncertificates}
        addBtnVisible={true}
        addBtnTitle={'Add Transaction Certificate'}
        handleAddBtnClick={handleAdd}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
