import * as React from 'react';
import dayjs from 'dayjs';
import { State, WorkflowInstance } from '~/backendlib/workflow/types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Timeline from '@mui/lab/Timeline';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import SubmitIcon from '@mui/icons-material/FileUpload';
import ValidationIcon from '@mui/icons-material/Verified';
import ReviewIcon from '@mui/icons-material/Rule';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import jsonSchema from '~/gen/jsonschemas/add_notes.json';
import uiSchema from '~/gen/ui-schemas/add_notes-ui-schema.json';
import { ReactJsonSchemaForm } from '~/components/lib/ReactJsonSchemaForm';
import validator from '@rjsf/validator-ajv8';
import { TabsContainer, TabPanel } from './ValidationWfTabs';
import { IStatusDisplayProps, NextAction, UserSubmitEvent, WorkflowInstProps } from './types';
import { useOperator } from '~/contexts/OperatorContext';
import { httpGet, httpPost } from '~/frontendlib/model-lib/lib';
import {
  QueryObserverResult,
  UseBaseMutationResult,
  UseMutationResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import CircularLoader from '../common/CircularLoader';
import { WfEventSubmission, submitEventRQ, submitWfEvent } from '~/frontendlib/model-lib/workflow';
import MutationWrapper from '../ui/MutationWrapper';

export default function ValidationView(props: WorkflowInstProps) {
  const [wf, setWf] = React.useState<WorkflowInstance | null>(null);
  const [loading, seLoading] = React.useState<boolean>(false);
  const operatorCtx = useOperator();
  const url = operatorCtx.getApiUrl(`/workflow/WfInstance/${props.wfId}`);
  const getRQ = useQuery([url], () => httpGet(url), {
    enabled: false,
  });

  const onSuccess = () => {
    if (props.reload) {
      props.reload();
    }
    if (props.closeDrawer) {
      props.closeDrawer();
    }
  };
  const validationMutation = useMutation(submitWfEvent, {
    onSuccess,
  });

  React.useEffect(() => {
    if (!props.wfId) {
      return;
    }
    seLoading(true);
    getRQ.refetch().then((data: QueryObserverResult<any>) => {
      const wf = data.data as WorkflowInstance;
      if (!wf) {
        return;
      }
      setWf(wf);
      seLoading(false);
    });
  }, [props.wfId]);

  return (
    <MutationWrapper mutation={validationMutation}>
      <Grid container>
        <Grid item xs={3}>
          <TimelineView {...props} wf={wf} />
        </Grid>
        <Grid item xs={8}>
          <CircularLoader value={loading}>
            <TabsContainer
              makeStateArr={makeStateArr}
              stateLabel={historyStateLabel}
              editLabel={'Edit'}
              wf={wf}
              domainObjectId={props.domainObjectId}
            >
              <WorkflowResponseEditor
                sendServerRequest={sendServerRequest}
                validationMutation={validationMutation}
                wf={wf}
                jsonSchema={jsonSchema}
                uiSchema={uiSchema}
                domainSchemaName={props.domainSchemaName}
                domainObjectId={props.domainObjectId}
                reload={props.reload}
                closeDrawer={props.closeDrawer}
              />
            </TabsContainer>
          </CircularLoader>
        </Grid>
      </Grid>
    </MutationWrapper>
  );

  async function sendServerRequest(
    eventName: UserSubmitEvent,
    domainSchemaName: string,
    domainObjectId: string,
    formData: any,
  ) {
    const org = operatorCtx.operator?.slug;
    if (!org) {
      console.error('No org found');
      return;
    }
    if (!wf?.id) {
      console.error('No wf id found');
      return;
    }
    const input: WfEventSubmission = {
      org,
      domainSchemaId: domainSchemaName,
      instanceId: wf?.id,
      eventName,
      eventData: formData,
    };
    validationMutation.mutate(input);
  }
}

function hasPermission(action: NextAction) {
  console.debug('no permission');
  return true;
}

function determineNextAction(wf: WorkflowInstance | null) {
  if (!wf?.state) {
    return NextAction.Submit;
  }
  switch (wf.state.name) {
    case 'validateFailed':
    case 'reviewFailed':
      return NextAction.Resubmit;
    case 'waitingForReview':
      return NextAction.Review;
    case 'waitingForValidation':
      return NextAction.Validate;
    default:
      return NextAction.Submit;
  }
}

function stateLabel(state: State) {
  if (!state) {
    return 'Not submitted';
  }
  switch (state.name) {
    case 'validated':
      return 'Validated';
    case 'validateFailed':
      return 'Validation Failed';
    case 'reviewFailed':
      return 'Review Failed';
    case 'waitingForReview':
      return 'Waiting for Review';
    case 'waitingForValidation':
      return 'Waiting for Validation';
    default:
      return state.name;
  }
}

function historyStateLabel(state: State) {
  if (!state) {
    return 'Not submitted';
  }
  switch (state.name) {
    case 'validated':
      return 'Validated';
    case 'validateFailed':
      return 'Validation Failed';
    case 'reviewFailed':
      return 'Review Failed';
    case 'waitingForReview':
      return 'Under Review';
    case 'waitingForValidation':
      return 'Under Validation';
    default:
      return state.name;
  }
}

type SendToServerFunction = (
  eventName: UserSubmitEvent,
  domainSchemaName: string,
  domainObjectId: string,
  formData: any,
) => Promise<any>;

interface IActionPanelProps extends WorkflowInstProps {
  formData: any;
  wf: WorkflowInstance | null;
  sendServerRequest: SendToServerFunction;
  closeDrawer: Function;
  validationMutation: any;
}

function ActionButtonPanel({
  wf,
  domainSchemaName,
  domainObjectId,
  formData,
  sendServerRequest,
  reload,
  closeDrawer,
  validationMutation,
}: IActionPanelProps) {
  const action = determineNextAction(wf);
  if (!hasPermission(action)) {
    return null;
  }
  const onClick = (action: UserSubmitEvent) => () =>
    sendServerRequest(action, domainSchemaName, domainObjectId, formData).then(() => {});
  const isReady = formData?.notes?.length > 0;
  const isBusy = validationMutation.isLoading;
  const isDisabled = isBusy || !isReady;
  switch (action) {
    case NextAction.Submit:
      return (
        <Button
          id='submitForReviewButton'
          disabled={isDisabled}
          onClick={onClick(UserSubmitEvent.Submit)}
          variant='contained'
        >
          Submit for Review
        </Button>
      );
    case NextAction.Review:
      return (
        <Stack direction='row' spacing={2}>
          <Button
            id='review&AcceptButton'
            disabled={isDisabled}
            onClick={onClick(UserSubmitEvent.ReviewPass)}
            variant='contained'
          >
            Review - Accept
          </Button>
          <Button
            id='review&RejectButton'
            disabled={isDisabled}
            onClick={onClick(UserSubmitEvent.ReviewFail)}
            variant='contained'
          >
            Review - Reject
          </Button>
        </Stack>
      );
    case NextAction.Validate:
      return (
        <Stack direction='row' spacing={2}>
          <Button
            id='validate&AcceptButton'
            disabled={isDisabled}
            onClick={onClick(UserSubmitEvent.ValidatePass)}
            variant='contained'
          >
            Validate - Accept
          </Button>
          <Button
            id='validate&RejectButton'
            disabled={isDisabled}
            onClick={onClick(UserSubmitEvent.ValidateFail)}
            variant='contained'
          >
            Validate - Reject
          </Button>
        </Stack>
      );
    case NextAction.Resubmit:
      return (
        <Stack direction='row' spacing={2}>
          <Button
            id='resubmitButton'
            disabled={isDisabled}
            onClick={onClick(UserSubmitEvent.Resubmit)}
            variant='contained'
          >
            Resubmit
          </Button>
        </Stack>
      );
    default:
      break;
  }
  return null;
}

function StatusDisplay(props: IStatusDisplayProps) {
  const { label, icon, state } = props;
  const color = props.color;
  const user = state?.data.event?.userSession?.name || state?.data.event?.userSession?.email;
  const ts = state?.data.event?.ts;
  const tsStr = ts ? dayjs(ts).format('DD/MM/YY hh:mm') : '';

  const Small = (props: any) => (
    <div>
      <small>{props.children}</small>
    </div>
  );
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color={color}>{icon}</TimelineDot>
        {!props.endState ? <TimelineConnector /> : <></>}
      </TimelineSeparator>
      <TimelineContent sx={{ m: 'auto 0' }} variant='body2' color='text.secondary'>
        <Typography component='span'>{label}</Typography>
        {user && <Typography component={Small}>{user}</Typography>}
        {tsStr && <Typography component={Small}>{tsStr}</Typography>}
      </TimelineContent>
    </TimelineItem>
  );
}

function makeStateArr(node: State | undefined): State[] {
  if (!node) {
    return [];
  }
  if (!node.history) {
    return [node];
  }
  return [node, ...makeStateArr(node.history?.previousState)];
}

function getReviewColor(stateName: string) {
  switch (stateName) {
    case 'waitingForReview':
      return 'primary';
    case 'validated':
    case 'validateFailed':
    case 'waitingForValidation':
      return 'success';
    case 'reviewFailed':
      return 'error';
    default:
      return 'grey';
  }
}

function getSubmitColor(stateName: string) {
  switch (stateName) {
    case 'validateFailed':
    case 'reviewFailed':
      return 'primary';
    default:
      return 'success';
  }
}

function getValidationColor(stateName: string) {
  switch (stateName) {
    case 'validated':
      return 'success';
    case 'validateFailed':
      return 'error';
    case 'waitingForValidation':
      return 'primary';
    default:
      return 'grey';
  }
}

function TimelineView(props: any) {
  const wf: WorkflowInstance = props.wf;

  const historyStates = makeStateArr(wf?.state);
  const validatedState = historyStates.find((st) => st.name === 'validated');
  const validationFailedState = historyStates.find((st) => st.name === 'validateFailed');
  const reviewedState = historyStates.find((st) => st.name === 'waitingForValidation');
  const reviewFailedState = historyStates.find((st) => st.name === 'reviewFailed');
  const submittedState = historyStates.find((st) => st.name === 'waitingForReview');
  const currentStateName = wf?.state?.name;
  const submitColor = getSubmitColor(currentStateName);
  const reviewColor = getReviewColor(currentStateName);
  const validationColor = getValidationColor(currentStateName);

  return (
    <>
      <div>
        Status: <strong>{stateLabel(wf?.state)}</strong>
      </div>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        <StatusDisplay
          color={submitColor}
          label={'Draft'}
          wf={wf}
          state={submittedState}
          icon={<SubmitIcon htmlColor='white' />}
          setSelectedState={props.setSelectedState}
        />
        <StatusDisplay
          label={'Review'}
          color={reviewColor}
          wf={wf}
          state={reviewedState || reviewFailedState}
          icon={<ReviewIcon htmlColor='white' />}
          setSelectedState={props.setSelectedState}
        />
        <StatusDisplay
          label={'Validation'}
          color={validationColor}
          wf={wf}
          state={validatedState || validationFailedState}
          icon={<ValidationIcon htmlColor='white' />}
          setSelectedState={props.setSelectedState}
          endState={true}
        />{' '}
      </Timeline>
    </>
  );
}

function WorkflowResponseEditor(props: any) {
  const [formData, setFormData] = React.useState<any>({});
  const wf: WorkflowInstance = props.wf;
  const sendServerRequest = props.sendServerRequest;
  const domainSchemaName: string = props.domainSchemaName;
  const domainObjectId: string = props.domainObjectId;
  const stateName = wf?.state?.name || 'start';
  // If validation is complete, there is no editor to show
  if (stateName === 'validated') {
    return <div>Validation completed </div>;
  }
  // Working around some weird typescript error saying children are
  // not allowed when RJSF clearly allows them.
  const RJSF: any = ReactJsonSchemaForm;
  const onChange = ({ formData }: { formData: any }) => setFormData(formData);
  return (
    <RJSF
      validator={validator}
      modelName='add_notes'
      schema={jsonSchema}
      uiSchema={uiSchema}
      formData={formData}
      onSubmit={props.onSubmit}
      onSuccess={props.onSuccess}
      onChange={onChange}
      onError={props.onError}
      onSettled={props.onSettled}
      onSubmitAttempt={props.onSubmitAttempt}
      onFormError={props.onFormError}
      mainBtnLabel={props.mainBtnLabel}
    >
      <ActionButtonPanel
        sendServerRequest={sendServerRequest}
        validationMutation={props.validationMutation}
        wf={wf}
        domainSchemaName={domainSchemaName}
        domainObjectId={domainObjectId}
        formData={formData}
        reload={props.reload}
        closeDrawer={props.closeDrawer}
      />
    </RJSF>
  );
}
