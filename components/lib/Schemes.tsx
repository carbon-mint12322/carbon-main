import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import { Paper, Box, Button } from '@mui/material';
import _ from 'lodash';
import { stringDateFormatter } from '~/utils/dateFormatter';
import TableView from '~/container/landparcel/details/TableView';

import {
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import ListActionModal from '~/components/lib/ListActionModal';

import axios from 'axios';
import { useRouter } from 'next/router';

interface SchemesProps {
  schemesData: any;
  ownerType: string;
  reFetch: () => void;
}
const SchemeEditor = dynamic(
  import('~/gen/data-views/scheme/schemeEditor.rtml'),
);

const styles = {
  renderActionCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
};

export default function Schemes({
  schemesData,
  ownerType,
  reFetch,
}: SchemesProps) {
  const [openModal, setOpenModal] = useState(false);
  const { getApiUrl, changeRoute } = useOperator();
  const router = useRouter();
  const toggleOpenModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenModal((openModal) => !openModal);
  };
  const handleRowClick = (params: GridRowParams) => {
    changeRoute(`/scheme/${params?.row?.id}`);
  };
  const { openToast } = useAlert();

  const handleAddSchemeSubmit = async (formData: any) => {
    try {
      const apiUrl = getApiUrl(`/scheme`);
      await axios
        .post(apiUrl, {
          ...formData,
          schemeOwner: router.query.id,
          ownerType: ownerType
        })
        .then((res) => {
          openToast('success', 'Scheme added!');
        });
      reFetch && reFetch();
      toggleOpenModal();
    } catch (error: any) {
      openToast('error', 'Failed to add scheme');
      console.log(error);
    }
  };

  const handleEditFormSubmit = async (data: any, id: string) => {
    try {
      delete data?._id;
      const res = await axios.post(getApiUrl(`/scheme/${id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated scheme details');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update scheme details');
    }
  };

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row.id}
          schema={'scheme'}
          data={data.row}
          reFetch={() => reFetch()}
          Editor={SchemeEditor}
          onSubmit={handleEditFormSubmit}
          canActivate={false}
          canEdit={true}
          canDelete={true}
        />
      </Box>
    );
  };
  const cbFilter = {};

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'certificationbody': // this key is defined as ui:options in yaml
          return cbFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  return (
    <>
      <Dialog open={Boolean(openModal)} onClose={toggleOpenModal} fullWidth maxWidth={'md'}>
        <SchemeEditor
          formContext={formContext}
          onSubmit={handleAddSchemeSubmit}
          onCancelBtnClick={toggleOpenModal}
        />
      </Dialog>
      <TableView
        getRowId={(item) => item.fbId}
        name='Schemes'
        columnConfig={[
          {
            field: 'fbId',
            headerName: 'ID',
            flex: 1,
          },
          {
            field: 'scheme',
            headerName: 'Scheme',
            flex: 1,
          },
          {
            field: 'registrationDate',
            headerName: 'Registration Date',
            valueGetter: (params: GridValueGetterParams) => {
              const date = params.row.registrationDate;
              return date ? stringDateFormatter(date) : '';
            },
            flex: 1,
          },
          {
            field: 'conversionStatus',
            headerName: 'Conversion Status',
            flex: 1,
          },
          {
            field: 'certificationStatus',
            headerName: 'Certification Status',
            flex: 1,
          },
          {
            field: 'validityStartDate',
            headerName: 'Validity Start Date',
            valueGetter: (params: GridValueGetterParams) => {
              const date = params.row.validityStartDate;
              return date ? stringDateFormatter(date) : '';
            },
            flex: 1,
          },
          {
            field: 'validityEndDate',
            headerName: 'Validity End Date',
            valueGetter: (params: GridValueGetterParams) => {
              const date = params.row.validityEndDate;
              return date ? stringDateFormatter(date) : '';
            },
            flex: 1,
          },
          {
            field: 'status',
            headerName: 'Status',
            flex: 1,
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
        key='schemes'
        data={schemesData}
        addBtnVisible={true}
        addBtnTitle={'Add Scheme'}
        handleRowClick={handleRowClick}
        handleAddBtnClick={toggleOpenModal}
      />
    </>
  );
}
