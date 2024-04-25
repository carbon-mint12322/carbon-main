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

const CroppingSystemEditor = dynamic(
  import('~/gen/data-views/add_croppingsystem/add_croppingsystemEditor.rtml'),
);

interface CroppingSystemProps {
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

export default function CroppingSystem(props: CroppingSystemProps) {
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
      const res = await axios.post(getApiUrl('/croppingsystem'), data);
      if (res) {
        props?.reFetch && props.reFetch();
        openToast('success', 'Cropping System Saved');
        setOpenDialog(false);
      }
    } catch (error: any) {
      openToast('error', error?.response?.data.error || error?.message || 'Something went wrong');
    }
  };

  const onEditFormSubmit = async (formData: any, id: string) => {
    try {
      const apiUrl = getApiUrl(`/croppingsystem/${id}`);
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res) => {
          openToast('success', 'Cropping System details updated');
        });
    } catch (error) {
      console.error('Error updating Cropping System status:', error);
      throw new Error('Error updating event status');
    }
  };

  const renderActionCell = (data: any) => {

    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row.id}
          schema={'croppingsystem'}
          data={data.row}
          reFetch={props?.reFetch}
          Editor={CroppingSystemEditor}
          onSubmit={onEditFormSubmit}
          canBeCompleted={false}
          showCompleteOption={true}
          canActivate={false}
          canEdit={
            !(
              data.row.mainCrop ||
              data.row.interCrop1 ||
              data.row.interCrop2 ||
              data.row.borderCrop1 ||
              data.row.coverCrop1
            )
          }
          canDelete={
            !(
              data.row.mainCrop ||
              data.row.interCrop1 ||
              data.row.interCrop2 ||
              data.row.borderCrop1 ||
              data.row.coverCrop1
            )
          }
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

  const maxInterCropsCount = Math.max(
    ...props.data.map((item: any) => (item.interCrops ? Object.keys(item.interCrops).length : 0))
  );

  const interCropColumns = Array.from({ length: maxInterCropsCount }, (_, i) => ({
    field: `interCrops.interCrop${i + 1}`,
    headerName: `Inter Crop ${i + 1}`,
    flex: 1,
    valueGetter: (params: any) => params.row.interCrops[`interCrop${i + 1}`] || null,
  }));

  const maxBorderCropsCount = Math.max(
    ...props.data.map((item: any) => (item.borderCrops ? Object.keys(item.borderCrops).length : 0))
  );

  const borderCropColumns = Array.from({ length: maxBorderCropsCount }, (_, i) => ({
    field: `borderCrops.borderCrop${i + 1}`,
    headerName: `Border Crop ${i + 1}`,
    flex: 1,
    valueGetter: (params: any) => params.row.borderCrops[`borderCrop${i + 1}`] || null,
  }));

  const maxMixedCropsCount = Math.max(
    ...props.data.map((item: any) => (item.mixedCrops ? Object.keys(item.mixedCrops).length : 0))
  );

  const mixedCropColumns = Array.from({ length: maxMixedCropsCount }, (_, i) => ({
    field: `mixedCrops.mixedCrop${i + 1}`,
    headerName: `Mixed Crop ${i + 1}`,
    flex: 1,
    valueGetter: (params: any) => params.row.mixedCrops[`mixedCrop${i + 1}`] || null,
  }));


  const maxCoverCropsCount = Math.max(
    ...props.data.map((item: any) => (item.coverCrops ? Object.keys(item.coverCrops).length : 0))
  );

  const coverCropColumns = Array.from({ length: maxCoverCropsCount }, (_, i) => ({
    field: `coverCrops.coverCrop${i + 1}`,
    headerName: `Cover Crop ${i + 1}`,
    flex: 1,
    valueGetter: (params: any) => params.row.coverCrops[`coverCrop${i + 1}`] || null,
  }));

  const columns = [
    {
      field: 'name',
      headerName: 'Cropping System Name',
      flex: 1,
    },
    {
      field: 'fieldId',
      headerName: 'Field Parcel',
      flex: 1,
    },
    {
      field: 'mainCrop',
      headerName: 'Main Crop',
      flex: 1,
    },
    ...interCropColumns,
    ...borderCropColumns,
    ...mixedCropColumns,
    ...coverCropColumns,
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
      flex: 1,
      renderCell: renderActionCell,
    }
  ];



  return (
    <>
      <TableView
        getRowId={(item) => item.id}
        name='Cropping systems'
        columnConfig={columns}
        key='core-agriculture-field-parcels'
        data={props.data}
        addBtnVisible={props.buttonVisible}
        addBtnTitle={'Add Cropping System'}
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
          title={'Add Cropping System'}
        >
          <CroppingSystemEditor
            onSubmit={handleFormSubmit}
            formContext={formContext}
            onCancelBtnClick={handleClose}
          />
        </Dialog>
      </If>
    </>
  );
}
