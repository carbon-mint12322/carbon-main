import { MoreHorizOutlined } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useAlert } from '~/contexts/AlertContext';
import { capitalize } from 'lodash';

import axios from 'axios';
import { useOperator } from '../../../contexts/OperatorContext';
import Dialog from '~/components/lib/Feedback/Dialog';
import { EventData } from '~/container/crop/details/Events';
import UpdateEntity from '~/components/lib/Entity/update';

interface ListActionModalProps {
  isActive: boolean;
  id: string;
  schema: string;
  data?: any;
  reFetch?: any;
  Editor?: any;
  onSubmit?: any;
  canEdit?: boolean;
  canActivate?: boolean;
  canDelete?: boolean;
  canBeCompleted?: boolean;
  modelName?: string;
  parentId?: string;
  childResourceUri?: string;
  showCompleteOption?: boolean;
  resourceName?: string;
  canView?: boolean;
  onClick?: (event?: EventData) => void;
  formContext?: any;
  wfName?: string;
  transformErrors?: any;
  loadData?: any;
}

export default function ListActionModal({
  isActive,
  id,
  schema,
  modelName,
  childResourceUri,
  parentId,
  data,
  reFetch,
  Editor,
  onSubmit,
  canEdit = true,
  canActivate = true,
  canDelete = true,
  canView = true,
  canBeCompleted = false,
  showCompleteOption = false,
  resourceName,
  onClick,
  formContext,
  wfName,
  transformErrors,
  loadData
}: ListActionModalProps) {

  const [openMenu, setOpenMenu] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setViewModal] = useState(false);
  const [entityData, setEntityData] = useState(data);
  const buttonRef = useRef(null);
  const activationOption = isActive ? 'Deactivate' : 'Activate';
  const markAsCompletedOption = 'Mark As Completed';
  const { getApiUrl, operator } = useOperator();

  const { openToast } = useAlert();

  const toggleMenu = (e: React.MouseEvent) => {
    e?.stopPropagation?.();
    setOpenMenu(!openMenu);
  };
  const handleActivation = async (e: React.MouseEvent) => {
    toggleMenu(e);
    try {
      const apiUrl = getApiUrl(`/${schema}/${id}`);
      await axios.post(apiUrl, {
        active: !isActive,
      });
      reFetch?.();
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAsCompleted = async (e: React.MouseEvent) => {
    toggleMenu(e);
    const resourceNameDisplay: string = capitalize(resourceName ?? schema);
    if (window.confirm(`Are you sure you want to mark this ${resourceNameDisplay} as completed?`)) {
      try {
        const apiUrl = getApiUrl(`/${schema}/${id}`);
        await axios.post(apiUrl, {
          status: 'Completed'
        });
        reFetch?.();
      } catch (error) {
        console.log(error);
      }
    }

  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setViewModal(false);
    setOpenMenu(false);
  };

  const handleSubmit = async (formData: any) => {
    setOpenModal(false);
    setViewModal(false);
    try {
      await onSubmit?.(formData, id);
      await reFetch?.();
    } catch (error) {
      console.log(error);
    }
    setOpenMenu(false);
    handleCloseModal();
  };

  const handleEditModal = async () => {
    if (!data) {
      const dataLoad = await loadData?.();
      setEntityData(dataLoad?.data)
    }
    setOpenModal(true);
  };

  const handleViewModal = async () => {
    if (!data) {
      const dataLoad = await loadData?.();
      setEntityData(dataLoad?.data)
    }
    setViewModal(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    toggleMenu(e);

    const resourceNameDisplay: string = capitalize(resourceName ?? schema);

    if (window.confirm(`Are you sure you want to delete this ${resourceNameDisplay}?`)) {
      try {
        const apiUrl = schema === 'nested' ? getApiUrl(`/${schema}/${modelName}/${parentId}/${childResourceUri}/${id}`) : getApiUrl(`/${schema}/${id}`);
        await axios.delete(apiUrl).then((res: any) => {
          openToast('success', `${resourceNameDisplay} deleted successfully.`);
        });
        reFetch?.();
      } catch (error) {
        openToast('error', `Failed to delete ${resourceNameDisplay}!`);
        console.log(error);
      }
    }
  };

  return (
    <>
      <IconButton onClick={toggleMenu} ref={buttonRef}>
        <MoreHorizOutlined />
      </IconButton>
      <Menu anchorEl={buttonRef.current} open={openMenu} onClose={toggleMenu}>
        {canActivate ? (
          <MenuItem onClick={handleActivation}>{activationOption}</MenuItem>
        ) : (
          <MenuItem disabled>{activationOption}</MenuItem>
        )}

        {canEdit ? (
          [
            <MenuItem key='edit' onClick={handleEditModal}>
              Edit
            </MenuItem>,
            <Dialog
              key='dialog'
              open={openModal}
              onClose={handleCloseModal}
              fullWidth
              maxWidth={'md'}
            >
              {wfName ? (
                <UpdateEntity
                  entityId={id}
                  schema={schema}
                  entityWfName={wfName}
                  formContext={formContext}
                  transformErrors={transformErrors}
                  org={operator?.slug}
                  negateMargin={true}
                  onClick={() => { setOpenModal(false); reFetch?.(); }}
                />
              ) : (
                <Editor
                    data={entityData}
                  formData={{
                    data: entityData,
                  }}
                  onSubmit={handleSubmit}
                  reFetch={reFetch}
                  readonly={false}
                  formContext={formContext}
                  transformErrors={transformErrors}
                />
              )}
            </Dialog>,
          ]
        ) : (
          <MenuItem disabled>Edit</MenuItem>
        )}

        {canView ? (
          [
            <MenuItem key='view' onClick={handleViewModal}>
              View
            </MenuItem>,
            <Dialog
              key='dialog'
              open={openViewModal}
              onClose={handleCloseModal}
              fullWidth
              maxWidth={'md'}
            >
              {wfName ? (
                <UpdateEntity
                  entityId={id}
                  schema={schema}
                  entityWfName={wfName}
                  formContext={formContext}
                  org={operator?.slug}
                  readonly={true}
                  negateMargin={true}
                />
              ) : (
                <Editor
                    data={entityData}
                  formData={{
                    data: entityData,
                  }}
                  onSubmit={handleSubmit}
                  reFetch={reFetch}
                  readonly={true}
                  formContext={formContext}
                />
              )}
            </Dialog>,
          ]
        ) : (
          <MenuItem disabled>View</MenuItem>
        )}

        {canDelete ? (
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        ) : (
          <MenuItem disabled>Delete</MenuItem>
        )}

        {showCompleteOption && (canBeCompleted ? (
          <MenuItem onClick={handleMarkAsCompleted}>{markAsCompletedOption}</MenuItem>
        ) : (
          <MenuItem disabled>{markAsCompletedOption}</MenuItem>
        ))}
      </Menu>
    </>
  );
}
