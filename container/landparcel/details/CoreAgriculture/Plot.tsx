import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import TableView from '~/container/landparcel/details/TableView';

import Dialog from '~/components/lib/Feedback/Dialog';
import If from '~/components/lib/If';
import { useOperator } from '~/contexts/OperatorContext';
import { LandParcel, LandParcelCrop } from '~/frontendlib/dataModel';
import { useAlert } from '~/contexts/AlertContext';
import { Paper, Box, Button } from '@mui/material';
import axios from 'axios';
import ListActionModal from '~/components/lib/ListActionModal';

const Add_plotEditor = dynamic(import('~/gen/data-views/add_plot/add_plotEditor.rtml'));

interface PlotProps {
  lpId: string;
  lpData: LandParcel;
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

export default function Plot(props: PlotProps) {
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
      const res = await axios.post(getApiUrl('/plot'), data);
      if (res) {
        props?.reFetch && props.reFetch();
        openToast('success', 'Plot Saved');
        setOpenDialog(false);
      }
    } catch (error: any) {
      openToast('error', error?.response?.data.error || error?.message || 'Something went wrong');
    }
  };

  const handleEditFormSubmit = async (data: any, id: string) => {
    try {
      delete data?._id;
      const res = await axios.post(getApiUrl(`/plot/${id}/`), data);
      if (res) {
        openToast('success', 'Successfully updated plot details');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update plot details');
    } 
  };

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          schema={'plot'}
          canActivate={false}
          isActive={data.row.active}
          id={data.row.id}
          data={data.row}
          reFetch={props.reFetch}
          Editor={Add_plotEditor}
          onSubmit={handleEditFormSubmit}
          canEdit={true}
          canDelete={true}
          formContext={formContext}
        />
      </Box>
    );
  };

  const formContext: any = {
    map: props.lpData?.map,
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
        name='Plot'
        columnConfig={[
          {
            field: 'name',
            headerName: 'Plot Name',
            flex: 1,
          },
          {
            field: 'fieldName',
            headerName: 'Field Parcel',
            flex: 1,
          },
          {
            field: 'category',
            headerName: 'Category',
            flex: 1,
          },
          {
            field: 'area',
            headerName: 'Area',
            flex: 1,
          },
          {
            field: 'crop',
            headerName: 'Crop',
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
        key='core-agriculture-plots'
        data={props.data}
        addBtnVisible={props.buttonVisible}
        addBtnTitle={'Add Plot'}
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
          title={'Add Plot'}
        >
          <Add_plotEditor
            onSubmit={handleFormSubmit}
            formContext={formContext}
            onCancelBtnClick={handleClose}
          />
        </Dialog>
      </If>
    </>
  );
}
