import { MoreHorizOutlined } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useAlert } from '~/contexts/AlertContext';
import { camelCase, capitalize } from 'lodash';
import dynamic from 'next/dynamic';


import axios from 'axios';
import { useOperator } from '../../../contexts/OperatorContext';
import { useRouter } from 'next/router';
import Dialog from '~/components/lib/Feedback/Dialog';

export interface IActivationParams {
  id: string;
  status: boolean;
}
interface ListActionProps {
  isActive: boolean;
  id: string;
  schema: string;
  category?: string;
  onActivationClick?: (params?: IActivationParams) => void;
  resourceName?: string;
  canEdit?: boolean;
  canAddEvent?: boolean;
  canActivate?: boolean;
  canDelete?: boolean;
  canDuplicate?: boolean;
  canMarkAsCompleted?: boolean;
  markAsCompletedVisible?: boolean;
  handleDuplicate?: (id: string) => void;
}

export default function ListAction({
  isActive,
  id,
  schema,
  category,
  onActivationClick,
  canEdit = false,
  canActivate = true,
  canAddEvent = false,
  canDelete = true,
  canDuplicate = false,
  canMarkAsCompleted = false,
  resourceName,
  markAsCompletedVisible = true,
  handleDuplicate = (id) => { },
}: ListActionProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();
  const buttonRef = useRef(null);
  const activationOption = isActive ? 'Deactivate' : 'Activate';
  const markAsCompletedOption = 'Mark As Completed';
  const { changeRoute, getApiUrl } = useOperator();

  const { openToast } = useAlert();

  const toggleMenu = (e: React.MouseEvent) => {
    e?.stopPropagation?.();
    setOpenMenu(!openMenu);
  };
  const handleActivation = async (e: React.MouseEvent) => {
    toggleMenu(e);
    try {
      const status = !isActive;
      const apiUrl = getApiUrl(`/${schema}/${id}`);
      await axios.post(apiUrl, {
        active: status,
      });
      onActivationClick?.({ id, status });
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
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleEdit = async (e: React.MouseEvent) => {
    toggleMenu(e);
    try {
      changeRoute(`/${schema}/${id}/edit`);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (e: React.MouseEvent) => {
    toggleMenu(e);
    if (
      window.confirm(
        `Are you sure you want to delete this ${camelCase(schema)?.charAt(0).toUpperCase() + camelCase(schema)?.slice(1)
        }?`,
      )
    ) {
      try {
        const apiUrl = getApiUrl(`/${schema}/${id}`);
        await axios.delete(apiUrl).then((res: any) => {
          openToast(
            'success',
            `${camelCase(schema).charAt(0).toUpperCase() + camelCase(schema).slice(1)
            } deleted successfully`,
          );
        });
        onActivationClick?.();
      } catch (error) {
        openToast('error', 'Failed to delete ' + `${camelCase(schema)}`);
        console.log(error);
      }
    }
  };
  const handleAddEvent = async (e: React.MouseEvent) => {
    try {
      if (schema == 'croppingsystem') {
        changeRoute(`/croppingsystem/${id}/create-event`);
      } else if (schema == 'productionsystem') {
        changeRoute(`/productionsystem/${id}/${category?.toLowerCase()}/create-event`);
      } else if (schema == 'poultry') {
        changeRoute(`/poultrybatch/${id}/create-event`);
      }

    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <IconButton onClick={toggleMenu} ref={buttonRef}>
        <MoreHorizOutlined />
      </IconButton>
      <Menu anchorEl={buttonRef.current} open={openMenu} onClose={toggleMenu}>
        {canActivate ? (
          <MenuItem id='activeButton' onClick={handleActivation}>
            {activationOption}
          </MenuItem>
        ) : (
          <MenuItem id='disableActiveButton' disabled>
            {activationOption}
          </MenuItem>
        )}

        {canDuplicate && <MenuItem onClick={() => handleDuplicate(id)}>Duplicate</MenuItem>}

        {canEdit ? (
          <MenuItem id='activeEditButton' onClick={handleEdit}>
            Edit
          </MenuItem>
        ) : (
          <>
            <MenuItem id='disableEditButton' disabled>
              Edit
            </MenuItem>
          </>
        )}

        {canDelete ? (
          <MenuItem id='activeDeleteButton' onClick={handleDelete}>
            Delete
          </MenuItem>
        ) : (
          <MenuItem id='disableDeleteButton' disabled>
            Delete
          </MenuItem>
        )}

        {canAddEvent && (
          <MenuItem id='addEventButton' onClick={handleAddEvent}>
            Add Event
          </MenuItem>
        )}
        {markAsCompletedVisible && (canMarkAsCompleted ? (
          <MenuItem onClick={handleMarkAsCompleted}>{markAsCompletedOption}</MenuItem>
        ) : (
          <MenuItem disabled>{markAsCompletedOption}</MenuItem>
        ))}
      </Menu>
    </>
  );
}
