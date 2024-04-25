import { WorkflowDefinition } from '~/backendlib/workflow/types';

const wfdef: WorkflowDefinition = {
  name: 'validation-workflow',
  startStateName: 'start',
  domainSchemaId: 'seedNgmoTestReport',
  description: 'Submit-review-validate workflow for seedNgmoTestReport',
  states: [
    {
      name: 'start',
      description: 'start state',
      triggers: [
        {
          eventName: 'start',
          description: 'New submission',
          roles: ['seedNgmoTestReport.own'],
          inputSchema: {},
          processingSteps: [
            {
              name: 'createDomainObject',
              description: 'Create X',
              importPath: 'createDomainObject',
            },
            {
              name: 'notifyReviewer',
              description: 'Notify reviewer',
              importPath: 'notifyReviewer',
            },
          ],
          transitions: [
            {
              condition: { name: 'always', importPath: 'always' },
              state: 'waitingForReview',
            },
          ],
        },
      ],
    },
    {
      name: 'waitingForReview',
      description: 'Waiting for review of data',
      triggers: [
        {
          eventName: 'reviewPass',
          description: 'A reviewer is verifying the submitted data',
          roles: ['seedNgmoTestReport.review'],
          inputSchema: {
            type: 'object',
            properties: { notes: { type: 'string' } },
            required: ['notes'],
          },
          processingSteps: [
            {
              name: 'updateReviewed',
              description: 'Update seedNgmoTestReport',
              importPath: 'updateReviewed',
            },
          ],
          transitions: [
            {
              condition: { name: 'always', importPath: 'always' },
              state: 'waitingForValidation',
            },
          ],
        },
        {
          eventName: 'verifyFailed',
          description: 'A reviewer is rejecting the submitted data',
          roles: ['seedNgmoTestReport.review'],
          inputSchema: {
            type: 'object',
            properties: { notes: { type: 'string' } },
            required: ['notes'],
          },
          processingSteps: [
            {
              name: 'updateReviewFailed',
              description: 'Update seedNgmoTestReport',
              importPath: 'updateReviewFailed',
            },
          ],
          transitions: [
            {
              condition: { name: 'always', importPath: 'always' },
              state: 'verificationFailed',
            },
          ],
        },
      ],
    },
    {
      name: 'waitingForValidation',
      description: 'Waiting for validation of data',
      triggers: [
        {
          eventName: 'validate',
          description: 'A validator is verifying the submitted data',
          roles: ['seedNgmoTestReport.validate'],
          inputSchema: {
            type: 'object',
            properties: { notes: { type: 'string' } },
            required: ['notes'],
          },
          processingSteps: [
            {
              name: 'updateValidated',
              description: 'Update seedNgmoTestReport',
              importPath: 'updateValidated',
            },
          ],
          transitions: [
            {
              condition: { name: 'always', importPath: 'always' },
              state: 'validated',
            },
          ],
        },
        {
          eventName: 'validateFailed',
          description: 'A validator is rejecting the submitted data',
          roles: ['seedNgmoTestReport.validate'],
          inputSchema: {
            type: 'object',
            properties: { notes: { type: 'string' } },
            required: ['notes'],
          },
          processingSteps: [
            {
              name: 'updateValidationFailed',
              description: 'Update seedNgmoTestReport',
              importPath: 'updateValidationFailed',
            },
          ],
          transitions: [
            {
              condition: { name: 'always', importPath: 'always' },
              state: 'validationFailed',
            },
          ],
        },
      ],
    },
    {
      name: 'verificationFailed',
      description: 'Verification failed',
      triggers: [
        {
          eventName: 'resubmitVerificationFailure',
          description: 'Resubmission',
          roles: ['seedNgmoTestReport.own'],
          inputSchema: {},
          processingSteps: [
            {
              name: 'updateReviewFailed',
              description: 'Update seedNgmoTestReport',
              importPath: 'updateReviewFailed',
            },
          ],
          transitions: [
            {
              condition: { name: 'always', importPath: 'always' },
              state: 'waitingForReview',
            },
          ],
        },
      ],
    },
    {
      name: 'validated',
      description: 'Validation is complete',
      isEndState: true,
      triggers: [],
    },
    {
      name: 'validationFailed',
      description: 'Validation failed',
      triggers: [
        {
          eventName: 'resubmitValidationFailure',
          description: 'Resubmission',
          roles: ['seedNgmoTestReport.own'],
          inputSchema: {},
          processingSteps: [
            {
              name: 'updateValidationFailed',
              description: 'Update seedNgmoTestReport',
              importPath: 'updateValidationFailed',
            },
          ],
          transitions: [
            {
              condition: { name: 'always', importPath: 'always' },
              state: 'waitingForReview',
            },
          ],
        },
      ],
    },
  ],
};
export default wfdef;
