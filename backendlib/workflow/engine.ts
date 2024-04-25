import { ObjectId } from 'mongodb';
import {
  WorkflowInstance as WfInst,
  WorkflowContext as WfCtx,
  Trigger,
  MappedWorkflowDefinition as MappedDef,
} from './types';
import * as T from './types';
import { getWfDbApi, getDomainDbApi } from './db';
import { jschemaValidate } from './json-schema';
//import wfdefSchema from "./workflow-def-schema.json";
import { findTrigger, compareRoles } from './util';
import makeLogger from '../logger';
import { IDbTransactionSession, IDbModelApi } from '../db/types';
import { getModel } from '../db/adapter';
import { LazyPipelineTask, runAsPipeline } from '~/utils/task-lib';

const logger = makeLogger('wfengine');
const logger2 = makeLogger('workflow-step-logger');

export const loadInstance = async (instId: string): Promise<WfInst> => {
  const dbApi = getWfDbApi();
  const dbSession = await dbApi.startSession();
  const obj = await dbApi.dbLoadInstance(instId);
  const data = obj.data || obj;
  return {
    ...data,
    dbSession,
  };
};

export const loadDomainObject = async (schemaId: string, instId: string): Promise<any> => {
  const obj: any = await getDomainDbApi(schemaId).load(instId);
  return obj.data || obj;
};

export const updateDomainObject = async (
  schemaId: string,
  instId: string,
  mods: any,
  userId: string,
  dbSession: IDbTransactionSession
): Promise<any> => {
  const api = getDomainDbApi(schemaId);
  return api.update(instId, mods, userId, dbSession);
};

/**
 * Create a new instance of a WF and start.
 */
export const startWf = async (
  wfDef: MappedDef,
  domainObjectId: string | undefined,
  eventName: string,
  eventData: any,
  session: T.UserSession,
): Promise<WfInst> =>
  Promise.resolve(wfDef)
    .then((wfdef) => {
      console.log(domainObjectId, eventName, eventData);
      return wfdef;
    })
    // Need to check user's role here (TODO)
    .then(instantiateWf(eventData, session, domainObjectId))
    .then(
      (instance: WfInst) =>
        injectStartEvent(wfDef, eventName, eventData, session)(instance).then(() => instance), // return WF instance
    );

/**
 * Create a new instance of a WF and start.
 *
 * This version takes schema ID for the domain object, and overwrites the
 * schema ID inside the wfdef.  This is useful to reuse the same WFDEF for multiple schemas,
 * like in the case of Validation workflow, which can be used for farmers, events, etc.
 */
export const startWf2 = async (
  domainSchemaId: string, // overrides the definition inside the WF Def
  wfDef: MappedDef,
  domainObjectId: string | undefined,
  eventName: string,
  eventData: any,
  session: T.UserSession,
): Promise<WfInst> =>
  Promise.resolve({ ...wfDef, domainSchemaId }).then((wfDef) =>
    startWf(wfDef, domainObjectId, eventName, eventData, session),
  );

/**
 * Create a new instance of a WF and start.
 *
 * This version takes context schema ID and context object ID,
 * and instantiates workflow and starts it.
 *
 * DomainContext object example: It's the crop object when you're
 * running event workflows. The event itself is domainObect.
 */
export const startWf3 = async (
  wfDef: MappedDef,
  domainSchemaId: string,
  domainObjectId: string | undefined,
  domainContextSchemaId: string,
  domainContextObjectId: string,
  eventName: string,
  eventData: any,
  session: T.UserSession,
): Promise<WfInst> =>
  Promise.resolve({
    ...wfDef,
    domainSchemaId,
  })
    .then(
      instantiateWf(
        eventData,
        session,
        domainObjectId,
        domainContextSchemaId,
        domainContextObjectId,
      ),
    )
    .then(injectStartEvent(wfDef, eventName, eventData, session))
    .then((ctx: T.WorkflowContext) => ctx.wf);

/**
 * create a WF instance from a definition.
 *
 * An instance is created, and the state is set to "initial".  A start
 * event will need to be injected for the engine to start.
 */
const instantiateWf =
  (
    initialData: any,
    session: T.UserSession,
    domainObjectId?: string,
    domainContextSchemaId?: string,
    domainContextObjectId?: string,
  ) =>
    async (def: MappedDef): Promise<WfInst> => {
      const dbSession: IDbTransactionSession = await getWfDbApi().startSession();
      const instance: WfInst = {
        id: new ObjectId().toString(),
        // Reference to the domain object
        domainSchemaId: def.domainSchemaId,
        domainObjectId,
        domainContextSchemaId,
        domainContextObjectId,
        def,
        state: makeInitialState(def.startStateName, initialData),
        dbSession,
      };
      await getWfDbApi().dbCreateInstance(instance, dbSession, session.userId);
      return Promise.resolve(instance);
    };

/**
 * Validate an event against the matching trigger definition.
 * Primarily schema validation specified in the trigger def.
 */
const validateEvent = (
  trigger: Trigger,
  event: T.WorkflowEvent,
): Promise<T.JsonSchemaValidationResult> => jschemaValidate(trigger.inputSchema, event.data);

/**
 * Verify that the user in the current session is authorized to invoke
 * the incoming event trigger.
 */
export const verifyRole = async (ctx: WfCtx): Promise<void> =>
  findTrigger(ctx.wfDef, ctx.wf.state.name, ctx.event.eventName).then(compareRoles(ctx));

const isDefined = (x: any) => (x ? true : false);
/**
 * Process an incoming event from a user.
 */
export const processEvent = async (
  userSession: T.UserSession,
  wfdef: T.MappedWorkflowDefinition,
  event: T.WorkflowEvent,
): Promise<WfCtx> => {
  if (!event.wfInstanceId) {
    console.error("wfInstanceId must be defined in event's context");
    return Promise.reject(new Error('wfInstanceId must be defined'));
  }
  const wf: WfInst = await loadInstance(event.wfInstanceId);
  wfdef.domainSchemaId = wf.domainSchemaId; // For cases where domainSchema is passed in (at start time) instead of statically defined in YAML files
  return wf.dbSession
    ? wf.dbSession.withTransaction(_processEvent(userSession, wf, wfdef, event))
    : Promise.reject(new Error('dbSession must be defined'));
};
/**
 * Process an incoming event from a user.
 */
const _processEvent =
  (
    userSession: T.UserSession,
    wf: WfInst,
    wfdef: T.MappedWorkflowDefinition,
    event: T.WorkflowEvent,
  ) =>
    async (): Promise<WfCtx> => {
      const domainObjDbApi: IDbModelApi = getModel(wfdef.domainSchemaId);
      const dbSession: IDbTransactionSession = wf.dbSession
        ? wf.dbSession
        : await getWfDbApi().startSession();
      const ctx = await createContext(event, userSession, wf, wfdef, domainObjDbApi, dbSession);

      await verifyRole(ctx);

      // find trigger definition
      const trigger: T.MappedTrigger = await findTrigger(
        ctx.wfDef,
        ctx.wf.state.name,
        ctx.event.eventName,
      );
      logger.info('Validating event');
      // console.log({ schema: trigger.inputSchema, data: event.data });
      // validate schema (JSON schema validation) of incoming object
      // with what's in the trigger definition. validateEvent will
      // promise-reject if the event is not valid.
      await validateEvent(trigger, event);

      // execute steps
      logger.info('Executing steps');
      await executeSteps(ctx, trigger);
      // evaluate transition
      logger.info('Evaluating transitions');
      const transition: T.MappedTransition | undefined = await evalTransitions(ctx, trigger);

      logger.debug('Chosen transition', transition);
      const newState = transition ? transition.state : ctx.wf.state.name;
      // If one of the transitions matches, then
      // change state
      logger.info(`transitioning to: ${newState}`);
      await transitionState(ctx, newState);

      // save updated instance
      logger.info(`[${wf.id}]updating instance state in DB `);
      const eventHistData = {
        eventName: event.eventName,
        data: event.data,
        ts: new Date().getTime(),
        userSession: userSession,
        validationLifeCycleData: event.validationLifeCycleData ?? {},
      };
      wf.state.data = { ...ctx.data, event: eventHistData };

      if (ctx.wf.domainObjectId) {
        delete ctx.data._id;
        await updateDomainObject(
          ctx.wf.domainSchemaId,
          ctx.wf.domainObjectId,
          ctx.data,
          userSession.userId,
          ctx.dbSession
        );
      }
      const result = await getWfDbApi().dbUpdateInstance(ctx.wf, ctx.dbSession, userSession.userId);
      return result;
    };

/**
 * Move state machine to a new state
 */
const transitionState = async (ctx: WfCtx, toState: string): Promise<void> => {
  const wf = ctx.wf;
  const newState: T.State = {
    name: toState,
    data: null,
    history: { previousState: wf.state },
  };
  wf.state = newState;

  return Promise.resolve();
};

/**
 * Inject a start event into a just-created workflow to kick start it.
 */
const injectStartEvent =
  (wfDef: MappedDef, eventName: string, eventData: any, session: T.UserSession) =>
    async (inst: WfInst) => {
      const event: T.WorkflowEvent = {
        eventName,
        wfInstanceId: inst.id,
        data: eventData,
      };
      try {
        return await processEvent(session, wfDef, event);
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

const createContext = async (
  event: T.WorkflowEvent,
  userSession: T.UserSession,
  inst: WfInst,
  def: T.MappedWorkflowDefinition,
  domainObjDbApi: IDbModelApi,
  dbSession: IDbTransactionSession,
): Promise<WfCtx> => {
  logger.info('loading ', inst.domainSchemaId, inst.domainObjectId);
  try {
    const domainObject = inst.domainObjectId
      ? await loadDomainObject(inst.domainSchemaId, inst.domainObjectId)
      : {};
    const domainContextObject =
      inst.domainContextObjectId && inst.domainContextSchemaId
        ? await loadDomainObject(inst.domainContextSchemaId, inst.domainContextObjectId)
        : {};
    return Promise.resolve({
      wf: inst,
      event,
      session: userSession,
      domainObject,
      domainContextObject,
      data: { ...domainObject, ...(event as any)?.eventData }, // alias, for backwards compatibility
      wfDef: def,
      logger: logger2,
      domainObjDbApi, // for DB operations on domain objects
      dbSession,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Execute steps in series
const step2Task = (step: T.MappedProcessingStep): LazyPipelineTask<WfCtx> =>
  (inputCtx: WfCtx) => {
    return Promise.resolve(step.func(inputCtx)).then((outputCtx) => {
      // If a step returns a context, then merge it with the input context
      return { ...inputCtx, ...(outputCtx || {}) };
    });
  };

const executeSteps = async (context: WfCtx, trigger: T.MappedTrigger): Promise<any> => {
  const steps = trigger.processingSteps || [];
  const tasks: LazyPipelineTask<WfCtx>[] = steps.map(step2Task);
  return runAsPipeline<WfCtx>(tasks)(context);
};

const evalTransitions = async (
  context: WfCtx,
  trigger: T.MappedTrigger,
): Promise<T.MappedTransition | undefined> => {
  const transitions: T.MappedTransition[] = trigger.transitions;
  const evaluations = transitions.map((tr) => tr.func(context));
  const matchedIndex = evaluations.findIndex((result) => (result ? true : false));
  return transitions[matchedIndex];
};

const makeInitialState = (startStateName: string, initialData: any): T.State => ({
  name: startStateName,
  data: initialData,
});
