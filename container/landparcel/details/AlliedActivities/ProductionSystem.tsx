import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import TableView from '~/container/landparcel/details/TableView';
import Dialog from '~/components/lib/Feedback/Dialog';
import If from '~/components/lib/If';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import { Box } from '@mui/material';
import axios from 'axios';
import ListAction from '~/components/lib/ListAction';

const ProductionSystemEditor = dynamic(
  import('~/gen/data-views/add_productionsystem/add_productionsystemEditor.rtml'),
);

interface ProductionSystemProps {
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

export default function ProductionSystem(props: ProductionSystemProps) {
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
      const res = await axios.post(getApiUrl('/productionsystem'), data);
      if (res) {
        props?.reFetch && props.reFetch();
        openToast('success', 'Production System Saved');
        setOpenDialog(false);
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update production system');
    }
  };

  const handleActivation = () => {
    props?.reFetch && props.reFetch();
  };

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListAction
          isActive={data.row.active}
          id={data.row.id}
          schema={'productionsystem'}
          onActivationClick={handleActivation}
          canActivate={false}
          canAddEvent={false}
          category={data.row.category}
          canEdit={true}
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
        name='Production system'
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
        key='core-agriculture-field-parcels'
        data={props.data}
        addBtnVisible={props.buttonVisible}
        addBtnTitle={'Add Production System'}
        handleAddBtnClick={() => {
          setOpenDialog(true);
        }}
      />
      <If value={openDialog}>
        <Dialog
          fullWidth={true}
          maxWidth={'lg'}
          open={openDialog}
          onClose={handleClose}
          title={'Add Production System'}
        >
          <ProductionSystemEditor
            onSubmit={handleFormSubmit}
            formContext={formContext}
            onCancelBtnClick={handleClose}
          />
        </Dialog>
      </If>
    </>
  );
}
