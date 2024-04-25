import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import TableView from '~/container/landparcel/details/TableView';
import ListActionModal from '~/components/lib/ListActionModal';
import { Box, Paper, Typography } from '@mui/material';
import FarmerOSPForm from '~/container/farmerosp/create';
import FarmerOSPEditForm from '~/container/farmerosp/edit';
import OrganicSystemPlanForm from '~/container/organicsystemplan/create';
import OrganicSystemPlanEditForm from '~/container/organicsystemplan/edit';
import { GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';

interface OrganicSystemPlanDetailsProps {
  data: any;
  reFetch: () => void;
}

export default function OrganicSystemPlanDetails({ data, reFetch }: OrganicSystemPlanDetailsProps) {
  const [openModal, setOpenModal] = useState(false);
  const [activeModal, setActiveModal] = useState('');
  const [openFarmerOSPModal, setOpenFarmerOSPModal] = useState(false);
  const [openConsolidatedOSPModal, setOpenConsolidatedOSPModal] = useState(false);

  const toggleOpenModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenModal((openModal) => !openModal);
  };

  const handleConsolidatedAddBtnClick = () => {
    setActiveModal('consolidatedosp');
    setOpenConsolidatedOSPModal(true);
  };

  const handleFarmerOSPAddBtnClick = () => {
    setActiveModal('farmerosp');
    setOpenFarmerOSPModal(true);
  };

  const handleSubmit = () => {
    toggleOpenModal();
    switch (activeModal) {
      case 'farmerosp':
        setOpenFarmerOSPModal(false);
        break;
      case 'consolidatedosp':
        setOpenConsolidatedOSPModal(false);
        break;
      default:
        break;
    }
  };

  const toggleOpenFarmerOSPModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenFarmerOSPModal((openFarmerOSPModal) => !openFarmerOSPModal);
  };

  const toggleOpenConsolidatedOSPModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenConsolidatedOSPModal((openConsolidatedOSPModal) => !openConsolidatedOSPModal);
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
    tablePadding: {
      mb: 8,
    },
  };

  const renderConsolidatedOSPActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row._id}
          schema={'organicsystemplan'}
          data={data.row}
          reFetch={reFetch}
          Editor={OrganicSystemPlanEditForm}
          canActivate={false}
          canEdit={true}
          canDelete={true}
        />
      </Box>
    );
  };

  const renderFarmeOSPActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row._id}
          schema={'farmerosps'}
          data={{ osps: data.row }}
          reFetch={reFetch}
          Editor={FarmerOSPEditForm}
          canActivate={false}
          canEdit={false}
          canDelete={false}
        />
      </Box>
    );
  };
  return (
    <>
      <Dialog
        open={Boolean(openConsolidatedOSPModal)}
        onClose={toggleOpenConsolidatedOSPModal}
        fullWidth
        maxWidth={'md'}
      >
        <OrganicSystemPlanForm
          collective={data?.id}
          handleSubmit={handleSubmit}
          reFetch={reFetch}
        />
      </Dialog>
      <TableView
        getRowId={(item) => item?.fbId}
        name={`Consolidated OSPs`}
        columnConfig={[
          {
            field: 'ospYear',
            headerName: 'OSP Year',
            flex: 1,
          },
          {
            field: 'otherRemarks',
            headerName: 'Remarks',
            flex: 1,
          },
          {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 100,
            flex: 1,
            renderCell: renderConsolidatedOSPActionCell,
          },
        ]}
        key={'organicSystemPlan-list'}
        data={data?.organicsystemplans}
        addBtnVisible={true}
        addBtnTitle={'Add Consolided OSP'}
        handleAddBtnClick={handleConsolidatedAddBtnClick}
        sx={styles.tablePadding}
      />
      <Dialog
        open={Boolean(openFarmerOSPModal)}
        onClose={toggleOpenFarmerOSPModal}
        fullWidth
        maxWidth={'md'}
      >
        <FarmerOSPForm collective={data?.id} handleSubmit={handleSubmit} reFetch={reFetch} />
      </Dialog>
      <TableView
        getRowId={(item) => item?.fbId}
        name={`Farmer OSPs`}
        columnConfig={[
          {
            field: 'year',
            headerName: 'OSP Year',
            width: 100,
          },
          {
            field: 'landParcel',
            headerName: 'Land Parcel',
            valueGetter: (params: GridValueGetterParams) => `${params.row.landParcel?.name || ''}`,
            width: 100,
          },
          {
            field: 'village',
            headerName: 'Village',

            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.personalDetails.address.village}`,
            width: 200,
          },
          {
            field: 'farmername',
            headerName: 'Farmer Name',

            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.personalDetails.firstName + ' ' + params.row.personalDetails.lastName
              }  `,
          },
          {
            field: 'fathersname',
            headerName: 'Fathers Name',

            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.personalDetails.fathersHusbandsName}`,
          },
          {
            field: 'tracenetcodeno',
            headerName: 'Tracenet Code No',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.operatorDetails?.farmerID}`,
          },
          {
            field: 'totalarea',
            headerName: 'Total Area (Ha)',

            width: 200,
            valueGetter: (params: GridValueGetterParams) => `${params.row.totalArea}`,
          },
          {
            field: 'latitude',
            headerName: 'Latitude',

            width: 200,
            valueGetter: (params: GridValueGetterParams) => `${params.row.latitude}`,
          },
          {
            field: 'longitude',
            headerName: 'Longitude',

            width: 200,
            valueGetter: (params: GridValueGetterParams) => `${params.row.longitude}`,
          },
          {
            field: 'crop1',
            headerName: 'Crop',

            width: 200,
            valueGetter: (params: GridValueGetterParams) => `${params.row.crops[0]?.crop}`,
          },
          {
            field: 'cropType1',
            headerName: 'Crop Type',

            width: 100,
            valueGetter: (params: GridValueGetterParams) => `${params.row.crops[0]?.cropType}`,
          },
          {
            field: 'cropArea1',
            headerName: 'Crop Area (Ha)',

            width: 100,
            valueGetter: (params: GridValueGetterParams) => `${params.row.crops[0]?.cropArea}`,
          },
          {
            field: 'estQty1',
            headerName: 'Est. Quantity (MT)',

            width: 100,
            valueGetter: (params: GridValueGetterParams) => `${params.row.crops[0]?.estQty}`,
          },
          {
            field: 'variety1',
            headerName: 'Variety',

            width: 100,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[0]?.variety ? params.row.crops[0]?.variety : ''}`,
          },
          {
            field: 'sowingDate1',
            headerName: 'Sowing Date',

            width: 200,
            valueGetter: (params: GridValueGetterParams) => `${params.row.crops[0]?.sowingDate}`,
          },

          {
            field: 'crop2',
            headerName: 'Crop',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.crop ? params.row.crops[1]?.crop : ''}`,
          },
          {
            field: 'cropType2',
            headerName: 'Crop Type',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.cropType ? params.row.crops[1]?.cropType : ''}`,
          },
          {
            field: 'cropArea2',
            headerName: 'Crop Area (Ha)',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.cropArea ? params.row.crops[1]?.cropArea : ''}`,
          },
          {
            field: 'estQty2',
            headerName: 'Est. Quantity (MT)',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.estQty ? params.row.crops[1]?.estQty : ''}`,
          },
          {
            field: 'variety2',
            headerName: 'Variety',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.variety ? params.row.crops[1]?.variety : ''}`,
          },
          {
            field: 'sowingDate2',
            headerName: 'Sowing Date',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.sowingDate ? params.row.crops[1]?.sowingDate : ''}`,
          },

          {
            field: 'crop3',
            headerName: 'Crop',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.crop ? params.row.crops[2]?.crop : ''}`,
          },
          {
            field: 'cropType3',
            headerName: 'Crop Type',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.cropType ? params.row.crops[2]?.cropType : ''}`,
          },
          {
            field: 'cropArea3',
            headerName: 'Crop Area (Ha)',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.cropArea ? params.row.crops[2]?.cropArea : ''}`,
          },
          {
            field: 'estQty3',
            headerName: 'Est. Quantity (MT)',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.estQty ? params.row.crops[2]?.estQty : ''}`,
          },
          {
            field: 'variety3',
            headerName: 'Variety',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.variety ? params.row.crops[2]?.variety : ''}`,
          },
          {
            field: 'sowingDate3',
            headerName: 'Sowing Date',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.crops[1]?.sowingDate ? params.row.crops[2]?.sowingDate : ''}`,
          },

          {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 200,

            renderCell: renderFarmeOSPActionCell,
          },
        ]}
        key={'farmerOSP-list'}
        data={data?.farmerosps}
        addBtnVisible={false}
        addBtnTitle={'Add Organic System Plan'}
        handleAddBtnClick={handleFarmerOSPAddBtnClick}
        sx={styles.tablePadding}
      />
    </>
  );
}
