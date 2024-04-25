import { useEffect, useState } from 'react';
import axios from 'axios';
import Dialog from '~/components/lib/Feedback/Dialog';
import ModalCircularLoader from '~/components/common/ModalCircularLoader';
import PlanEventEditor from '~/gen/data-views/planEvent/planEventEditor.rtml.jsx';
import PoultryPlanEventEditor from '~/gen/data-views/poultryPlanEvent/poultryPlanEventEditor.rtml';
import CowPlanEventEditor from '~/gen/data-views/cowPlanEvent/cowPlanEventEditor.rtml';
import GoatPlanEventEditor from '~/gen/data-views/goatPlanEvent/goatPlanEventEditor.rtml';
import SheepPlanEventEditor from '~/gen/data-views/sheepPlanEvent/sheepPlanEventEditor.rtml';
import AquaPlanEventEditor from '~/gen/data-views/aquaPlanEvent/aquaPlanEventEditor.rtml';
import CollectivePlanEventEditor from '~/gen/data-views/collectivePlanEvent/collectivePlanEventEditor.rtml';
import { useOperator } from '~/contexts/OperatorContext';
import { useAlert } from '~/contexts/AlertContext';
import { Crop, CropPlanEvent, PoultryPlanEvent, AquaCropPlanEvent } from '~/frontendlib/dataModel';
import { getEventPlanDataFormatter } from './getEventPlanDataFormatter';
import { getEventPlanCRUD } from './getEventPlanCRUD';
import dynamic from 'next/dynamic';

type CommonEventPlanProps = {
  eventPlanModalHandler?: string;
  currentPlanId?: string | undefined;
  category?: string;
  eventPlan?: CropPlanEvent | PoultryPlanEvent | AquaCropPlanEvent | undefined;
  showToggle: boolean;
  setShowToggle: (v: boolean) => void;
  onClose: () => void;
  onCreateOrUpdateCallback: () => void;
};

type CreateEventPlanProps = CommonEventPlanProps & {
  action: 'post';
};

type UpdateEventPlanProps = CommonEventPlanProps & {
  eventPlan: CropPlanEvent | PoultryPlanEvent | AquaCropPlanEvent;
  action: 'put';
};

export function EventPlanModalHandler({
  currentPlanId, // needed when both create & update functions
  category = 'crop',
  eventPlan, // needed when to update the event plan
  showToggle,
  setShowToggle,
  onClose,
  action,
  onCreateOrUpdateCallback,
  eventPlanModalHandler
}: CreateEventPlanProps | UpdateEventPlanProps) {
  const { getApiUrl } = useOperator();
  const { openToast } = useAlert();
  const [isSubmit, setIsSubmit] = useState(false);
  const onFormSubmitSucess = () => {
    openToast('success', 'Schedule Event Saved');
    setShowToggle(false);
  };

  const submitHttpAction = (data: CropPlanEvent, action: 'post' | 'put') => {
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

  const formSubmitHandler = async (data: CropPlanEvent) => {
    try {
      setIsSubmit(true);
      data.category = category;
      const res = await submitHttpAction(data, action);

      if (res) {
        onFormSubmitSucess();
      }

      onCreateOrUpdateCallback();
    } catch (error: any) {
      openToast('error', error?.message || 'Something went wrong');
    } finally {
      setIsSubmit(false);
    }
  };
  // const EntityEventEditor = () => eventPlanModalHandler ? dynamic(import(eventPlanModalHandler)) : <></>;

  // console.log({ eventPlanModalHandler, EntityEventEditor })
  return (
    <Dialog fullWidth maxWidth={'md'} open={showToggle} onClose={onClose}>
      <ModalCircularLoader open={isSubmit} disableEscapeKeyDown>

        {/* <EntityEventEditor
          formData={eventPlan && getEventPlanDataFormatter(eventPlan)}
          onSubmit={formSubmitHandler}
          onCancelBtnClick={onClose}
        /> */}


        <>
          {currentPlanId && category === 'crop' && (
            <PlanEventEditor
              formData={eventPlan && getEventPlanDataFormatter(eventPlan)}
              onSubmit={formSubmitHandler}
              onCancelBtnClick={onClose}
            />
          )}
          {currentPlanId && category === 'poultry' && (
            <PoultryPlanEventEditor
              formData={eventPlan && getEventPlanDataFormatter(eventPlan)}
              onSubmit={formSubmitHandler}
              onCancelBtnClick={onClose}
            />
          )}
          {currentPlanId && category === 'aquacrop' && (
            <AquaPlanEventEditor
              formData={eventPlan && getEventPlanDataFormatter(eventPlan)}
              onSubmit={formSubmitHandler}
              onCancelBtnClick={onClose}
            />
          )}
          {currentPlanId && category === 'collective' && (
            <CollectivePlanEventEditor
              formData={eventPlan && getEventPlanDataFormatter(eventPlan)}
              onSubmit={formSubmitHandler}
              onCancelBtnClick={onClose}
            />
          )}
          {currentPlanId && category === 'cow' && (
            <CowPlanEventEditor
              formData={eventPlan && getEventPlanDataFormatter(eventPlan)}
              onSubmit={formSubmitHandler}
              onCancelBtnClick={onClose}
            />
          )}
          {currentPlanId && category === 'goat' && (
            <GoatPlanEventEditor
              formData={eventPlan && getEventPlanDataFormatter(eventPlan)}
              onSubmit={formSubmitHandler}
              onCancelBtnClick={onClose}
            />
          )}
          {currentPlanId && category === 'sheep' && (
            <SheepPlanEventEditor
              formData={eventPlan && getEventPlanDataFormatter(eventPlan)}
              onSubmit={formSubmitHandler}
              onCancelBtnClick={onClose}
            />
          )}
        </>
      </ModalCircularLoader>
    </Dialog>
  );
}
