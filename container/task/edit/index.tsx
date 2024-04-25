import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const TaskEditor = dynamic(import('~/gen/data-views/task/taskEditor.rtml'));

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';

import { TaskFormData } from '~/frontendlib/dataModel';

interface TaskEditFormProps {
  data: any;
  handleSubmit: () => void;
  reFetch?: () => void;
  readonly?: boolean;
}

function TaskEditForm({ data, handleSubmit, reFetch, readonly = false }: TaskEditFormProps) {
  const [submit, setSubmit] = useState<boolean>(false);
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      setSubmit(true);
      const mc_id = data?._id;
      delete data?._id;
      delete data.assigneeUser;
      delete data.assignorUser;
      delete data.taskId;
      const res = await axios.post(getApiUrl(`/task/${mc_id}/`), data);
      if (res) {
        reFetch && reFetch();
        openToast('success', 'Successfully updated task details');
        handleSubmit();
      }
    } catch (error: any) {
      openToast('error', error?.message || 'Failed to update task details');
    } finally {
      setSubmit(false);
    }
  };

  return (
    <ModalCircularLoader open={submit} disableEscapeKeyDown>
      <TaskEditor
        formData={{
          data: data,
        }}
        onSubmit={handleFormSubmit}
        readonly={readonly}
      />
    </ModalCircularLoader>
  );
}

export default TaskEditForm;
