import { State, WorkflowInstance } from '~/backendlib/workflow/types';

export interface IStatusDisplayProps {
  icon: any;
  label: 'Draft' | 'Review' | 'Validation';
  state: State | undefined;
  wf: any;
  setSelectedState: any;
  color:
    | 'inherit'
    | 'grey'
    | 'success'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'warning'
    | undefined;
  endState?: any;
}

export type WorkflowInstProps = {
  wfId?: string;
  domainSchemaName: string;
  domainObjectId: string;
  reload?: Function;
  closeDrawer?: Function;
};

export enum UserSubmitEvent {
  Submit = 'userSubmit',
  Resubmit = 'resubmit',
  ReviewPass = 'reviewPass',
  ReviewFail = 'reviewFail',
  ValidatePass = 'validatePass',
  ValidateFail = 'validateFail',
}

export enum NextAction {
  Submit,
  Review,
  Validate,
  Resubmit,
  None,
}
