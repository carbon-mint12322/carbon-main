import React, { useState } from 'react';
import { useAlert } from '~/contexts/AlertContext';
import Dialog from '~/components/lib/Feedback/Dialog';
import If from '~/components/lib/If';
import {
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import TableView from '~/container/landparcel/details/TableView';
import AvatarWithName from '~/components/common/AvatarWithName';
import axios from 'axios';
import ListActionModal from '~/components/lib/ListActionModal';
import { useOperator } from '~/contexts/OperatorContext';
import { UserFormData } from '~/frontendlib/dataModel';

interface EntityUserListProps {
  data: any;
  modelName: string;
  entityId: string;
  reFetch: () => void;
  EntityUserEditor: any;
}
export default function EntityUserList({
  data,
  modelName,
  entityId,
  reFetch,
  EntityUserEditor,
}: EntityUserListProps) {

  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleFormSubmit = async (data: UserFormData) => {
    try {
      setOpenDialog(true);
      data = {
        ...data,
        entityId: entityId,
      };

      const res = await axios.post(getApiUrl(`/${modelName}-user`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'User Saved');
        setOpenDialog(false);
      }
    } catch (error: any) {
      openToast('error', error?.response?.data.error || error?.message || 'Failed to create user');
    } finally {
      setOpenDialog(false);
    }
  };

  function renderActionCell(params: GridRenderCellParams) {
    return (
      <ListActionModal
        isActive={params?.row?.active}
        id={params?.row?._id}
        schema={'collective-user'}
        data={params?.row}
        reFetch={reFetch}
        Editor={EntityUserEditor}
        canActivate={false}
        onSubmit={handleFormSubmit}
        canEdit={true}
        canDelete={false}
      />
    );
  }

  function renderUserNameCell(params: GridRenderCellParams) {
    const name = `${params.row?.personalDetails?.firstName || ''} ${params.row?.personalDetails?.lastName || ''
      }`;
    return <AvatarWithName name={name} />;
  }

  return (
    <>
      <TableView
        getRowId={(item) => item._id}
        name='Users'
        columnConfig={[
          {
            field: 'userName',
            headerName: 'User Name',
            minWidth: 220,
            flex: 1,
            renderCell: renderUserNameCell,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.personalDetails?.firstName} ${params.row.personalDetails?.lastName}`,
            hideable: false,
          },
          {
            field: 'fbId',
            headerName: 'ID',
            minWidth: 200,
            flex: 1,
          },
          {
            field: 'personalDetails.primaryPhone',
            headerName: 'Phone Number',
            minWidth: 200,
            flex: 1,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.personalDetails?.primaryPhone ? params.row.personalDetails?.primaryPhone : ''
              }`,
          },
          {
            field: 'personalDetails.address.village',
            headerName: 'Village',
            minWidth: 200,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row.personalDetails?.address?.village
                ? params.row.personalDetails?.address?.village
                : 'NA'
              }`,
          },
          {
            field: 'roles',
            headerName: 'Roles',
            sortable: false,
            minWidth: 200,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
              `${params.row?.rolesList
                ? params.row?.rolesList
                : 'NA'
              }`,
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
        key='entity-users'
        data={data}
        addBtnVisible={true}
        addBtnTitle={'Add User'}
        handleAddBtnClick={() => { setOpenDialog(true) }}

      />
      <If value={openDialog}>
        <Dialog
          fullWidth={true}
          maxWidth={'lg'}
          open={openDialog}
          onClose={handleClose}
          title={'Add User'}
        >
          <EntityUserEditor
            onSubmit={handleFormSubmit}

            onCancelBtnClick={handleClose}
          />
        </Dialog>
      </If>
    </>

  );
}
