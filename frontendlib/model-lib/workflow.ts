/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation } from '@tanstack/react-query';
import { httpPost } from './lib';
import { WorkflowEventHandlerInput, WorkflowStartHandlerInput } from '~/backendlib/workflow/types';

export type WfEventSubmission = WorkflowEventHandlerInput & {
  org: string;
  domainSchemaId?: string;
};

export const submitWfEvent = async (input: WfEventSubmission) => {
  return httpPost(`/api/${input.org}/workflow/${input.instanceId}/event`, input);
};

const startWorkflow = async (input: WorkflowStartHandlerInput) =>
  httpPost(`/api/${input.org}/workflow`, input);

export const startWorkflowRQ = (options: any = {}) => useMutation(startWorkflow, options);
export const submitEventRQ = (options: any = {}) => useMutation(submitWfEvent, options);

export type CreateEventInput = WorkflowEventHandlerInput & {
  org: string;
  domainSchemaName: string; // crop, poultry etc
  domainInstanceId: string; // instance ID of crop
};
export const createEvent = async (input: CreateEventInput) => {
  return httpPost(
    `/api/farmbook/${input.org}/create-event/${input.domainSchemaName}/${input.domainInstanceId}/create`,
    input,
  );
};
export const createEventRQ = (options: any = {}) => useMutation(createEvent, options);

export type CreateEntityInput = WorkflowEventHandlerInput & {
  org: string;
  domainSchemaName: string; 
  domainInstanceId: string; 
  domainSchemaId?: string;
};
export const createEntity = async (input: CreateEntityInput) => {
  return httpPost(
      `/api/farmbook/${input.org}/create-entity/${input.domainSchemaName}/create`,
      input,
  );
};
export const createEntityRQ = (options: any = {}) => useMutation(createEntity, options);
