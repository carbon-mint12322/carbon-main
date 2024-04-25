
import * as T from './types';
import { normalizeDef } from './util';

// Map function names to functions in processingSteps and transition
// conditions
export const mapToFunctions = (
  wfdef: T.WorkflowDefinition,
  functionTable: any,
): T.MappedWorkflowDefinition => {
  const normalized: T.WorkflowDefinition = normalizeDef(wfdef);
  const mappedStates = normalized.states.map(mapState(functionTable));
  return { ...wfdef, states: mappedStates };
};

const mapState =
  (functionTable: T.FunctionTable) =>
  (state: any): T.MappedStateType => {
    const mappedTriggers = state.triggers?.map(mapTrigger(functionTable));
    // console.log("[WF][MAP] ", mappedTriggers, state.triggers, "**");
    return {
      ...state,
      triggers: mappedTriggers || [],
    };
  };

const mapTrigger =
  (functionTable: T.FunctionTable) =>
  (trigger: T.Trigger): T.MappedTrigger => {
    const mappedTransitions: T.MappedTransition[] = trigger.transitions?.map(
      mapTransition(functionTable),
    );
    const mappedSteps: T.MappedProcessingStep[] = (trigger.processingSteps || []).map(
      mapStep(functionTable),
    );
    const mapped = {
      ...trigger,
      transitions: mappedTransitions || [],
      processingSteps: mappedSteps || [],
    };
    // console.log("[WF][MAP] mapped trigger", mapped);
    return mapped;
  };

const mapStep =
  (functionTable: T.FunctionTable) =>
  (step: T.ProcessingStep): T.MappedProcessingStep => {
    const func: any = functionTable[step.name];
    return { ...step, func };
  };

const mapTransition =
  (functionTable: any) =>
  (tr: T.Transition): T.MappedTransition => {
    let func: Function = () => true;
    if (tr.condition) {
      func = functionTable[tr.condition.name];
    }
    return { ...tr, func };
  };
