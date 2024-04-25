import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

import ModalCircularLoader from '~/components/common/ModalCircularLoader';
const Add_PlanEventEditor = dynamic(import('~/gen/data-views/planEvent/planEventEditor.rtml.jsx'));

import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import { EntityScheduledEventEditFormProps } from './index.interface';
import { EntityPlanEvent } from '../EntityEvents/index.interface';
import { getEventPlanDataFormatter } from '../../../frontendlib/plan/eventPlan/getEventPlanDataFormatter';


function EntityScheduledEventEditForm({
    data,
    handleSubmit,
    reFetch,
    readonly,
}: EntityScheduledEventEditFormProps) {
    const [submit, setSubmit] = useState<boolean>(false);
    const { getApiUrl } = useOperator();
    const { openToast } = useAlert();

    const handleFormSubmit = async (data: EntityPlanEvent) => {
        try {
            setSubmit(true);
            const event_id = data?._id;
            const currentPlanId = data?.planId;
            delete data?._id;
            const res = await axios.put(getApiUrl(`/plan/${currentPlanId}/update/${event_id}`), data);
            if (res) {
                reFetch && reFetch();
                openToast('success', 'Successfully updated scheduled events');
                handleSubmit();
            }
        } catch (error: any) {
            openToast('error', error?.message || 'Failed to update Scheduled Event');
        } finally {
            setSubmit(false);
        }
    };

    return (
        <ModalCircularLoader open={submit} disableEscapeKeyDown>
            <Add_PlanEventEditor
                formData={data && getEventPlanDataFormatter(data)}
                onSubmit={handleFormSubmit}
                readonly={readonly}
            />
        </ModalCircularLoader>
    );
}

export default EntityScheduledEventEditForm;
