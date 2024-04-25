import { intersection } from 'ramda';
import { WorkflowContext as WfCtx } from './types';
import * as T from './types';
import { getSessionRoles } from '../middleware/with-auth-api';
import makeLogger from '../logger';
import wfdefSchema from '../../gen/jsonschemas/WorkflowDef.json';

const validateLib = require('./validate-workflow-def');
const { validateWfDefSync } = validateLib;

const logger = makeLogger('wfutil');

/**
 * Find matching event type trigger from definition.
 *
 * Walk through the possible triggers in the current state of the
 * workflow and find the one matching the incoming event.
 */
export const findTrigger = (
  wfDef: T.MappedWorkflowDefinition,
  stateName: string,
  eventName: string,
): Promise<T.MappedTrigger> =>
  Promise.resolve(wfDef)
    .then(findCurrentStateType(stateName))
    // .then(taplog("validating state"))
    .then(checkStateTypeValidity)
    // .then(taplog("looking for trigger for " + eventName))
    .then(findCurrentTriggerDef(eventName))
    .then(checkTriggerValidity(eventName));

const taplog = (msg: string) => (x: any) => {
  logger.debug(msg, x);
  return x;
};

// Get state definition from context
const findCurrentStateType =
  (stateName: string) =>
  (wfDef: T.MappedWorkflowDefinition): T.MappedStateType | undefined =>
    wfDef.states.find((st: T.StateType) => st.name === stateName);

// Check that state definition exists
const checkStateTypeValidity = (stateDef: T.MappedStateType | undefined) =>
  stateDef
    ? Promise.resolve(stateDef)
    : Promise.reject(new Error('[util] Invalid current state name'));

// Find trigger definition from state definition
const findCurrentTriggerDef = (eventName: string) => (stateDef: T.MappedStateType) =>
  stateDef.triggers.find((tr: T.MappedTrigger) => tr.eventName === eventName);

// Check that trigger exists
const checkTriggerValidity = (eventName: string) => (triggerDef: T.MappedTrigger | undefined) =>
  triggerDef
    ? Promise.resolve(triggerDef)
    : Promise.reject(new Error('[util] Invalid event: ' + eventName));

// Compare roles of the user against the roles permitted in the
// workflow definition.
export const compareRoles =
  (context: WfCtx) =>
  (trigger: T.MappedTrigger): Promise<void> => {
    const isEmptyRoles = trigger?.roles?.length ? false : true;

    // If no roles are defined by the trigger, anyone can
    // execute the step
    if (isEmptyRoles) {
      return Promise.resolve(undefined);
    }
    const permittedRoles = trigger.roles || [];
    const userRoles = context.session.roles || [];
    const intersectionRoles = intersection(permittedRoles, userRoles);

    logger.debug(`[util][compareRoles]
      Permitted: ${permittedRoles}
      User roles: ${userRoles} 
      Intersection: ${intersectionRoles}
    `);
    if (intersectionRoles.length === 0) {
      logger.error(`[util]: Permission denied`);
      logger.error(`[util][compareRoles]
        Permitted: ${permittedRoles}
        User roles: ${userRoles} 
        Intersection: ${intersectionRoles}
      `);
      return Promise.reject(new Error('403'));
    }
    logger.debug(`[util]: Permission granted`);
    return Promise.resolve(undefined);
  };

/**
 * Make a workflow definition object that has no undefined's,with zero
 * lenghth arrays where an array value is not required, etc.
 */

export const normalizeDef = (wfdef: any): T.WorkflowDefinition => {
  const validationResult = validateWfDefSync(wfdefSchema, wfdef);
  if (validationResult.errors) {
    throw new Error(validationResult.errors);
  }
  const normalizedStates: T.StateType[] = wfdef.states.map((st: any) => {
    return st; // TODO
  });
  const normalizedDef: T.WorkflowDefinition = {
    name: wfdef.name,
    startStateName: wfdef.startStateName,
    domainSchemaId: wfdef.domainSchemaId,
    states: normalizedStates,
  };
  return normalizedDef;
};
