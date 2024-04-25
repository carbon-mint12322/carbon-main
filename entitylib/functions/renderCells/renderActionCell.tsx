import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ListActionModal from '~/components/lib/ListActionModal';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import axios from 'axios';

const styles = {
  renderActionCell: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
};

interface ActionCellProps {
  data: any;
  modelName: string;
  wfName?: string;
  formContext?: any;
  reFetch?: any;
  canEdit?: boolean;
  canDelete?: boolean;
  canActivate?: boolean;
  canBeCompleted?: boolean;
  showCompleteOption?: boolean;
  Editor?: any;
  onSubmit?: () => {};
}

const RenderActionCell = (props: ActionCellProps) => {
  const { getAPIPrefix } = useOperator();
  const { openToast } = useAlert();
  const { data, modelName, wfName, formContext, reFetch, Editor, onSubmit, canEdit = false, canDelete = false, canActivate = false, canBeCompleted = false, showCompleteOption = false } = props;

  const getEntityData = async (): Promise<{ data: any }> => {
    try {
      const API_URL = getAPIPrefix() + `/${modelName}/${data?.id}?simple=true`;
      const res: {
        data: any;
      } = await axios.get(API_URL);
      return { data: res?.data || {} };
    } catch (error) {
      console.error(error);
    }
    return { data: {} };
  };

  const handleSubmit = async (formData: any, id: string) => {
    try {
      delete formData._id;
      const apiUrl = getAPIPrefix() + `/${modelName}/${id}`;
      await axios
        .post(apiUrl, {
          ...formData,
        })
        .then((res: any) => {
          openToast('success', 'Details updated');
          onSubmit?.();
          reFetch?.();
        });
    } catch (error: any) {
      openToast('error', 'Failed to update details');
      console.log(error);
    }
  }

  return (
    <Box component={'div'} sx={styles.renderActionCell}>
      <ListActionModal
        canActivate={canActivate || data?.row?.status == 'Draft' || data?.row?.status == 'editable' || data?.row?.status == 'Initiated'}
        canEdit={canEdit || data?.row?.status == 'Draft' || data?.row?.status == 'editable' || data?.row?.status == 'Initiated'}
        canDelete={canDelete || data?.row?.status == 'Draft' || data?.row?.status == 'editable' || data?.row?.status == 'Initiated'}
        isActive={data?.row?.active}
        id={data?.row?.id}
        schema={modelName}
        formContext={formContext}
        wfName={wfName}
        reFetch={reFetch}
        canBeCompleted={canBeCompleted}
        showCompleteOption={showCompleteOption}
        Editor={Editor}
        onSubmit={handleSubmit}
        loadData={getEntityData}
      />
    </Box>
  );
};

export default RenderActionCell;
