import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import TableView from '~/container/landparcel/details/TableView';
import { LandParcelCrop } from '~/frontendlib/dataModel';
import Dialog from '~/components/lib/Feedback/Dialog';
import If from '~/components/lib/If';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import { Paper, Box, Button } from '@mui/material';
import axios from 'axios';
import ListActionModal from '~/components/lib/ListActionModal';

const ProcessingSystemEditor = dynamic(
  import('~/gen/data-views/add_processingsystem/add_processingsystemEditor.rtml'),
);

interface ProcessingSystemProps {
  lpId: string;
  buttonVisible: boolean;
  data: any;
  reFetch?: () => void;
}

const styles = {
  renderActionCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
};

export default function ProcessingSystem(props: ProcessingSystemProps) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();
  const fieldFilter = {
    landParcel: props.lpId,
  };
  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      data = {
        ...data,
        landParcel: props.lpId,
        status: 'Draft',
      };
      const res = await axios.post(getApiUrl('/processingsystem'), data);
      if (res) {
        props?.reFetch && props.reFetch();
        openToast('success', 'Processing System Saved');
        setOpenDialog(false);
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update processing system');
    }
  };

  const handleEditFormSubmit = async (data: any, id: string) => {
    try {
      delete data?.id;
      const res = await axios.post(getApiUrl(`/processingsystem/${id}/`), data);
      if (res) {
        openToast('success', 'Successfully updated processing system details');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update processing system details');
    } 
  };

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row.id}
          schema={'processingsystem'}
          data={data.row}
          reFetch={props?.reFetch}
          Editor={ProcessingSystemEditor}
          onSubmit={handleEditFormSubmit}
          canActivate={false}
          canEdit={true}
          canDelete={true}
        />
      </Box>
    );
  };

  const formContext: any = {
    getFilter: (key: string) => {
      switch (key) {
        case 'field': // this key is defined as ui:options in yaml
          return fieldFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };

  return (
    <>
      <TableView
        getRowId={(item) => item.id}
        name='Processing system'
        columnConfig={[
          {
            field: 'fieldName',
            headerName: 'Field Parcel',
            flex: 1,
          },
          {
            field: 'name',
            headerName: 'Name',
            flex: 1,
          },
          {
            field: 'category',
            headerName: 'Category',
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
        key='core-agriculture-processing-systems'
        data={props.data}
        addBtnVisible={props.buttonVisible}
        addBtnTitle={'Add Processing System'}
        handleAddBtnClick={() => {
          setOpenDialog(true);
        }}
      />
      <If value={openDialog}>
        <Dialog
          fullWidth={true}
          maxWidth={'md'}
          open={openDialog}
          onClose={handleClose}
          title={'Add Processing System'}
        >
          <ProcessingSystemEditor
            onSubmit={handleFormSubmit}
            formContext={formContext}
            onCancelBtnClick={handleClose}
          />
        </Dialog>
      </If>
    </>
  );
}
