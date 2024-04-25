import { FunctionComponent } from 'react';
import { WorkflowDefinition } from '../../backendlib/workflow/types';

type EvidenceLink = string;
export interface IEditorProps {
  wfName: string;
  domainObjectId?: string;
  evidences?: EvidenceLink[];
  onSubmit: (input: any) => any;
  formContext?: any;
}

export interface IBaseEventEditorProps extends IEditorProps {
  getWfStartSchemaName: (wfName: string) => string;
  getWfStartEventName: (wfName: string) => string;
  getEventEntryForm: (wfName: string, startSchemaName: string) => any;
  getWorkflowDef: (name: string) => Promise<WorkflowDefinition>;
}

export function BaseEventEditor(editorProps: IBaseEventEditorProps) {
  const { getWfStartSchemaName, getEventEntryForm, wfName } = editorProps;
  const startSchemaName: string = getWfStartSchemaName(wfName);

  const Form: FunctionComponent<any> = getEventEntryForm(wfName, startSchemaName);

  return <Form {...editorProps} />;
}
