import { useState, FunctionComponent } from 'react';
import { v4 as uuid } from 'uuid';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useOperator } from '~/contexts/OperatorContext';
import dynamic from 'next/dynamic';
import { EventForm } from '~/gen/workflows/index-fe';
import { WfEventSubmission, submitEventRQ,
  startWorkflowRQ, } from '~/frontendlib/model-lib/workflow';
import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';
import If from '~/components/lib/If';
import BaseReactJsonSchemaForm from '../lib/BaseReactJsonSchemaForm';

import * as T from '~/backendlib/workflow/types';

import { getWithRQBySchemaId } from '~/frontendlib/model-lib/crudRQ';
import { ListItem } from '@mui/material';


type WfInstViewProps = {
  instanceId: string;
};

type StartViewProps = {
  wfdef: T.WorkflowDefinition;
  domainObjectId?: string;
};

type WfRjsfProps = {
  instanceId: string;
  stateDef: T.StateType;
  stateData: any;
  triggers: T.Trigger[];
  wfdef: T.WorkflowDefinition;
  onSubmit: (eventName: string, x: any) => any;
  isSubmitting: boolean;
  error: any;
  isSubmitSuccess: boolean;
  isError: boolean;
};

const wfInstSchemaId = T.wfInstSchemaId;

export const WfInstView: FunctionComponent<WfInstViewProps> = (props: WfInstViewProps) => {
  const { operator } = useOperator();
  const { isLoading: isWfLoading, data: wfdata } = getWithRQBySchemaId(
    `/farmbook/${operator?.slug}${wfInstSchemaId}`,
    props.instanceId,
    {},
  );
  const submitMutation = submitEventRQ();

  if (isWfLoading) {
    return <div> Loading workflow ...</div>;
  }

  const wfInst: T.WorkflowInstance = wfdata as T.WorkflowInstance;
  const wfdef: T.WorkflowDefinition = wfInst.def;

  const currentState = wfInst.state.name;
  const stateDef: T.StateType | undefined = wfdef.states.find((st) => st.name === currentState);
  if (!stateDef) {
    return <div> Invalid data! </div>;
  }
  if (stateDef.isEndState) {
    return <div>Workflow Finished</div>;
  }
  const triggers = (stateDef as T.IntermediateStateType).triggers || [];
  const stateData = wfInst.state.data.event.data;

  const {
    isLoading: isSubmitting,
    isError,
    mutate,
    isSuccess: isSubmitSuccess,
    error: submitError,
  } = submitMutation;

  const onSubmit = (eventName: string, eventData: any) => {
    const input: WfEventSubmission = {
      org: operator?.slug || '',
      instanceId: wfInst.id,
      eventName,
      eventData,
    };
    return mutate(input);
  };
  return (
    <WfRjsf
      instanceId={props.instanceId}
      wfdef={wfdef}
      stateData={stateData}
      stateDef={stateDef}
      triggers={triggers}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={submitError}
      isSubmitSuccess={isSubmitSuccess}
      isError={isError}
    />
  );
};

/**
 * Start the workflow with this view
 */
export const WfStartView: FunctionComponent<StartViewProps> = (props: StartViewProps) => {
  const wfdef: T.WorkflowDefinition = props.wfdef;
  const stateDef: T.StateType | undefined = props.wfdef.states.find(
    (st) => st.name === wfdef.startStateName,
  );
  if (!stateDef) {
    return <div> Invalid workflow def! </div>;
  }
  const triggers = (stateDef as T.IntermediateStateType).triggers || [];
  const stateData = {};

  const submitMutation = startWorkflowRQ();
  const {
    isLoading: isSubmitting,
    isError,
    mutate,
    isSuccess: isSubmitSuccess,
    error: submitError,
  } = submitMutation;

  const instanceId = uuid();
  const onSubmit = (eventName: string, formData: any) => {
    const input: T.WorkflowStartHandlerInput = {
      instanceId,
      wfName: wfdef.name,
      domainObjectId: props.domainObjectId,
      eventName,
      eventData: formData,
    };
    return mutate(input);
  };
  return (
    <WfRjsf
      instanceId={instanceId}
      wfdef={props.wfdef}
      stateData={stateData}
      stateDef={stateDef}
      triggers={triggers}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={submitError}
      isSubmitSuccess={isSubmitSuccess}
      isError={isError}
    />
  );
};

const WfRjsf = (props: WfRjsfProps) => {
  const { stateData, triggers, wfdef, onSubmit } = props;

  const [eventIndex, setEventIndex] = useState(-1);
  const [formData, setFormData] = useState<any>(stateData);
  const triggerNames = triggers.map((tr) => tr.eventName);
  const triggerSchemaNames = triggers.map((tr) => tr.inputSchemaName);
  const displayNames = triggers.map((tr) => tr.description);

  const selectedEventSchemaName = triggerSchemaNames[eventIndex];

  function onChangeDetails(details: any) {
    setFormData({ ...formData, details });
  }

  const onSubmit2 = (formData: any) => {
    const eventName = triggerNames[eventIndex];
    return onSubmit(eventName, formData);
  };

  const handleEventSelect = (eventSelectedIndex: number) => {
    setEventIndex(eventSelectedIndex);
  };

  return (
    <div>
      <Stack spacing={2}>
        {/* <Typography variant='h4'>{wfdef.description}</Typography> */}
        <Paper
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            listStyle: 'none',
            m: 0,
            padding: 4
          }}
          elevation={4}
          component="ul"
        >
          <Typography >Please select an option below to proceed</Typography>
          {displayNames.map((event, index) => {
            let icon;
            if (eventIndex == index) {
              icon = <DoneIcon/>;
            } 
            return (
              <ListItem key={index}>
                <Chip
                  icon={icon}
                  label={event}
                  variant={eventIndex == index ? 'filled' : 'outlined'}
                  onClick={() => handleEventSelect(index)}
                />
              </ListItem>
            );
          })}
        </Paper>
        <If value={eventIndex != -1}>
          <Paper elevation={4} sx={{ padding: 4 }}>
            <EventForm
              eventName={selectedEventSchemaName}
              readonly={false}
              formData={formData}
              onChange={onChangeDetails}
              onSubmit={onSubmit2}
            />
          </Paper>
        </If>
      </Stack>
    </div>
  );
};

export default WfInstView;
