import { useState } from 'react';
import axios from 'axios';
import Dialog from '~/components/lib/Feedback/Dialog';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';
import { useOperator } from '~/contexts/OperatorContext';

import { useAlert } from '~/contexts/AlertContext';
import { EntityPlanEvent } from '../EntityEvents/index.interface';
import { getEventPlanDataFormatter } from '../../../frontendlib/plan/eventPlan/getEventPlanDataFormatter';
import { getEventPlanCRUD } from '../../../frontendlib/plan/eventPlan/getEventPlanCRUD';
import { CreateEventPlanProps, UpdateEventPlanProps } from './index.interface';



export function EntityEventPlanModalHandler({
    currentPlanId, // needed when both create & update functions
    category = 'crop',
    eventPlan, // needed when to update the event plan
    showToggle,
    setShowToggle,
    onClose,
    action,
    onCreateOrUpdateCallback,
    EntityEventEditor
}: CreateEventPlanProps | UpdateEventPlanProps) {
    const { getApiUrl } = useOperator();
    const { openToast } = useAlert();
    const [isSubmit, setIsSubmit] = useState(false);
    const onFormSubmitSucess = () => {
        openToast('success', 'Schedule Event Saved');
        setShowToggle(false);
    };

    const submitHttpAction = (data: EntityPlanEvent, action: 'post' | 'put') => {
        if (!currentPlanId) throw new Error('Plan not valid.');

        // Only check for update operation & throw error if event plan id is not available
        if (action === 'put' && !eventPlan?._id) throw new Error('Event plan id not valid.');

        const {
            uri,
            data: formattedData,
            action: httpVerb,
        } = getEventPlanCRUD({
            planId: currentPlanId,
            data,
            action,
            eventPlanId: eventPlan?._id || '',
        });

        return axios[httpVerb](getApiUrl(uri), formattedData);
    };

    const formSubmitHandler = async (data: EntityPlanEvent) => {
        try {
            setIsSubmit(true);
            data.category = category
            const res = await submitHttpAction(data, action);
            if (res) {
                onFormSubmitSucess();
            }
            onCreateOrUpdateCallback();
        } catch (error: any) {
            console.log('error', data, action)
            openToast('error', error?.message || 'Something went wrong');
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Dialog fullWidth maxWidth={'md'} open={showToggle} onClose={onClose}>
            <ModalCircularLoader open={isSubmit} disableEscapeKeyDown>
                {currentPlanId && EntityEventEditor ? (
                    <EntityEventEditor
                        formData={eventPlan && getEventPlanDataFormatter(eventPlan)}
                        onSubmit={formSubmitHandler}
                        onCancelBtnClick={onClose}
                    />
                ) : <p> No Plan editor found for this entity</p>}
            </ModalCircularLoader>
        </Dialog>
    );
}
