import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
import { Paper, Box, Button } from '@mui/material';
import ListActionModal from '~/components/lib/ListActionModal';
import CowForm from '~/container/cow/create';
import GoatForm from '~/container/goat/create';
import SheepForm from '~/container/sheep/create';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import axios from 'axios';

import { GridColDef, GridRowParams, GridValueGetterParams } from '@mui/x-data-grid';

const GoatEditor = dynamic(import('~/gen/data-views/add_goat/add_goatEditor.rtml'));
const CowEditor = dynamic(import('~/gen/data-views/add_cow/add_cowEditor.rtml'));
const SheepEditor = dynamic(import('~/gen/data-views/add_sheep/add_sheepEditor.rtml'));


const styles = {
  renderActionCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
  tablePadding: {
    mb: 8,
  },
};

export default function LiveStockDetails({ data, reFetch }: any) {
  const [openModal, setOpenModal] = useState(false);
  const [activeModal, setActiveModal] = useState('');

  // Add these state variables at the top of your component
  const [openCowModal, setOpenCowModal] = useState(false);
  const [openGoatModal, setOpenGoatModal] = useState(false);
  const [openSheepModal, setOpenSheepModal] = useState(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  // Update your button handlers to set the correct modal state variable

  const handleCowAddBtnClick = () => {
    setActiveModal('cow');
    setOpenCowModal(true);
  };

  const handleGoatAddBtnClick = () => {
    setActiveModal('goat');
    setOpenGoatModal(true);
  };

  const handleSheepAddBtnClick = () => {
    setActiveModal('sheep');
    setOpenSheepModal(true);
  };

  const toggleCowOpenModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenCowModal((openCowModal) => !openCowModal);
  };

  const toggleGoatOpenModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenGoatModal((openGoatModal) => !openGoatModal);
  };

  const toggleSheepOpenModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenSheepModal((openSheepModal) => !openSheepModal);
  };

  const toggleOpenModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenModal((openModal) => !openModal);
  };

  const handleSubmit = () => {
    toggleOpenModal();

    switch (activeModal) {
      case 'cow':
        setOpenCowModal(false);
        break;
      case 'goat':
        setOpenGoatModal(false);
        break;
      case 'sheep':
        setOpenSheepModal(false);
        break;
      default:
        break;
    }
  };

  const handleCowEditSubmit = async (data: any, id: string) => {
    try {
      delete data?._id;
      delete data?.id;
      const res = await axios.post(getApiUrl(`/cow/${id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated cow details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update cow details');
    } 
  };

  const handleGoatEditSubmit = async (data: any, id: string) => {
    try {
      delete data?._id;
      delete data?.id;
      const res = await axios.post(getApiUrl(`/goat/${id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated cow details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update cow details');
    }
  };

  const handleSheepEditSubmit = async (data: any, id: string) => {
    try {
      delete data?._id;
      delete data?.id;
      const res = await axios.post(getApiUrl(`/sheep/${id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated cow details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update cow details');
    }
  };


  const renderCowActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row.id}
          schema={'cow'}
          data={data.row}
          reFetch={reFetch}
          Editor={CowEditor}
          onSubmit={handleCowEditSubmit}
          canActivate={false}
          canEdit={data.row.status == 'Draft' ? true : false}
          canDelete={data.row.status == 'Draft' ? true : false}
        />
      </Box>
    );
  };

  const renderGoatActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row.id}
          schema={'goat'}
          data={data.row}
          reFetch={reFetch}
          Editor={GoatEditor}
          onSubmit={handleGoatEditSubmit}
          canActivate={false}
          canEdit={data.row.status == 'Draft' ? true : false}
          canDelete={data.row.status == 'Draft' ? true : false}
        />
      </Box>
    );
  };

  const renderSheepActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row.id}
          schema={'sheep'}
          data={data.row}
          reFetch={reFetch}
          Editor={SheepEditor}
          onSubmit={handleSheepEditSubmit}
          canActivate={false}
          canEdit={data.row.status == 'Draft' ? true : false}
          canDelete={data.row.status == 'Draft' ? true : false}
        />
      </Box>
    );
  };

  return (
    <>
      <Dialog open={openCowModal} onClose={toggleCowOpenModal} fullWidth maxWidth={'md'}>
        <CowForm
          lpData={data?.lpData}
          handleSubmit={handleSubmit}
          handleCancel={toggleCowOpenModal}
          reFetch={reFetch}
        />
      </Dialog>

      <TableView
        getRowId={(item) => item?.id}
        name='Cows'
        columnConfig={[
          {
            field: 'tagid',
            headerName: 'Tag ID',
            valueGetter: (params: GridValueGetterParams) => `${params?.row?.tagId}`,
            flex: 1,
          },
          {
            field: 'age',
            headerName: 'Age',
            valueGetter: (params: GridValueGetterParams) => `${params.row?.age}`,
            flex: 1,
          },
          {
            field: 'breed',
            headerName: 'Size',
            valueGetter: (params: GridValueGetterParams) => `${params.row?.breed}`,
            flex: 1,
          },
          {
            field: 'source',
            headerName: 'Breed',
            valueGetter: (params: GridValueGetterParams) => `${params.row?.cowSource}`,
            flex: 1,
          },
          {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 100,
            flex: 1,
            renderCell: renderCowActionCell,
          },
        ]}
        key={'allied-activities-cow'}
        data={data?.alliedActivityData?.cows}
        addBtnVisible={true}
        addBtnTitle={'Add Cow'}
        handleAddBtnClick={handleCowAddBtnClick}
        sx={styles.tablePadding}
      />

      <Dialog open={openGoatModal} onClose={toggleGoatOpenModal} fullWidth maxWidth={'md'}>
        <GoatForm
          lpData={data?.lpData}
          handleSubmit={handleSubmit}
          handleCancel={toggleGoatOpenModal}
          reFetch={reFetch}
        />
      </Dialog>

      <TableView
        getRowId={(item) => item?.id}
        name={'Goats'}
        columnConfig={[
          {
            field: 'tagid',
            headerName: 'Tag ID',
            valueGetter: (params: GridValueGetterParams) => `${params.row.tagId}`,
            flex: 1,
          },
          {
            field: 'age',
            headerName: 'Age',
            valueGetter: (params: GridValueGetterParams) => `${params.row.age}`,
            flex: 1,
          },
          {
            field: 'breed',
            headerName: 'Size',
            valueGetter: (params: GridValueGetterParams) => `${params.row.breed}`,
            flex: 1,
          },
          {
            field: 'source',
            headerName: 'Breed',
            valueGetter: (params: GridValueGetterParams) => `${params.row.goatSource}`,
            flex: 1,
          },
          {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 100,
            flex: 1,
            renderCell: renderGoatActionCell,
          },
        ]}
        key={'allied-activities-goat'}
        data={data?.alliedActivityData?.goats}
        addBtnVisible={true}
        addBtnTitle={'Add Goat'}
        handleAddBtnClick={handleGoatAddBtnClick}
        sx={styles.tablePadding}
      />

      <Dialog open={openSheepModal} onClose={toggleSheepOpenModal} fullWidth maxWidth={'md'}>
        <SheepForm
          lpData={data?.lpData}
          handleSubmit={handleSubmit}
          handleCancel={toggleSheepOpenModal}
          reFetch={reFetch}
        />
      </Dialog>

      <TableView
        getRowId={(item) => item?.id}
        name={'Sheep'}
        columnConfig={[
          {
            field: 'tagid',
            headerName: 'Tag ID',
            valueGetter: (params: GridValueGetterParams) => `${params.row?.tagId}`,
            flex: 1,
          },
          {
            field: 'age',
            headerName: 'Age',
            valueGetter: (params: GridValueGetterParams) => `${params.row?.age}`,
            flex: 1,
          },
          {
            field: 'breed',
            headerName: 'Size',
            valueGetter: (params: GridValueGetterParams) => `${params.row?.breed}`,
            flex: 1,
          },
          {
            field: 'source',
            headerName: 'Breed',
            valueGetter: (params: GridValueGetterParams) => `${params.row?.sheepSource}`,
            flex: 1,
          },
          {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 100,
            flex: 1,
            renderCell: renderSheepActionCell,
          },
        ]}
        key={'allied-activities-sheep'}
        data={data?.alliedActivityData?.sheeps}
        addBtnVisible={true}
        addBtnTitle={'Add Sheep'}
        handleAddBtnClick={handleSheepAddBtnClick}
        sx={styles.tablePadding}
      />
    </>
  );
}
