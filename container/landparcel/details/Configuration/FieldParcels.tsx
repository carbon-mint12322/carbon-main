import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Dialog from '~/components/lib/Feedback/Dialog';
import { Paper, Box, Button } from '@mui/material';
import _ from 'lodash';
import TableView from '~/container/landparcel/details/TableView';
import { GridValueGetterParams } from '@mui/x-data-grid';
import { LandParcelField } from '~/frontendlib/dataModel';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import ListActionModal from '~/components/lib/ListActionModal';
import {
  coordinateStringToCoordinateObject,
  polygonToMapCenter,
} from '~/utils/coordinatesFormatter';
import { calculatePolygonArea } from '~/utils/mapUtils';
import axios from 'axios';

interface CoreAgricultureProps {
  fieldsData: LandParcelField[];
  lpMap: any;
  handleFormSubmit: (data: any) => void;
  reFetch: () => void;
}
const LandParcelFieldEditor = dynamic(
  import('~/gen/data-views/landparcel_fields/landparcel_fieldsEditor.rtml'),
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

export default function Fields({
  fieldsData,
  lpMap,
  handleFormSubmit,
  reFetch,
}: CoreAgricultureProps) {
  const [openModal, setOpenModal] = useState(false);
  const { getApiUrl } = useOperator();
  const toggleOpenModal = (e?: any) => {
    e?.preventDefault?.();
    setOpenModal((openModal) => !openModal);
  };
  const handleFormSubmitAndClose = (data: any) => {
    handleFormSubmit(data);
    toggleOpenModal();
  };
  const { openToast } = useAlert();

  const handleEditFormSubmit = async (data: any, id: string) => {
    try {
      delete data?._id;
      let paths = coordinateStringToCoordinateObject(data?.map);
      let acres = calculatePolygonArea({ paths: paths });
      let coordinates = polygonToMapCenter(paths[0]);
      data.calculatedAreaInAcres = acres?.toFixed(2);
      data.location = coordinates;
      const res = await axios.post(getApiUrl(`/field/${id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated field parcel details');
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update field parcel details');
    } 
  };

  const handleMapError = () => {
    openToast('error', 'Upload Land Parcel Map before adding a Field Parcel');
  };

  const renderActionCell = (data: any) => {
    return (
      <Box component={'div'} sx={styles.renderActionCell}>
        <ListActionModal
          isActive={data.row.active}
          id={data.row._id}
          schema={'field'}
          data={data.row}
          reFetch={reFetch}
          Editor={LandParcelFieldEditor}
          onSubmit={handleEditFormSubmit}
          canActivate={false}
          canEdit={true}
          canDelete={true}
        />
      </Box>
    );
  };
  return (
    <>
      <Dialog open={Boolean(openModal)} onClose={toggleOpenModal} fullWidth maxWidth={'md'}>
        <LandParcelFieldEditor
          formContext={{ map: lpMap }}
          onSubmit={handleFormSubmitAndClose}
          onCancelBtnClick={toggleOpenModal}
        />
      </Dialog>
      <TableView
        getRowId={(item) => item.name}
        name='Field Parcels'
        columnConfig={[
          {
            field: 'fbId',
            headerName: 'ID',
            flex: 1,
          },
          {
            field: 'name',
            headerName: 'Name',
            flex: 1,
          },
          {
            field: 'areaInAcres',
            headerName: 'Area (acres)',
            flex: 1,
          },
          {
            field: 'calculatedAreaInAcres',
            headerName: 'Calculated Area (acres)',
            valueGetter: (params: GridValueGetterParams) =>
              `${_.round(params?.row?.calculatedAreaInAcres || 0, 2)}`,
            flex: 2,
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
        data={fieldsData}
        addBtnVisible={true}
        addBtnTitle={'Add Field'}
        handleAddBtnClick={lpMap ? toggleOpenModal : handleMapError}
      />
    </>
  );
}
