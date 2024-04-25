import { NextApiRequest, NextApiResponse } from 'next';

import { getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';

const Ajv = require('ajv');
const ajv = new Ajv();

import planEventSchema from '~/gen/jsonschemas/planEvent.json';
import poultryPlanEventSchema from '~/gen/jsonschemas/poultryPlanEvent.json';
import aquacropPlanEventSchema from '~/gen/jsonschemas/aquacropPlanEvent.json';
import landparcelPlanEventSchema from '~/gen/jsonschemas/landparcelPlanEvent.json';
import productionsystemPlanEventSchema from '~/gen/jsonschemas/productionsystemPlanEvent.json';
import definitionsSchema from '~/gen/jsonschemas/definitions.json';
import { httpPutHandler } from '~/backendlib/middleware/put-handler';
import dayjs from 'dayjs';
import reschedulePlanEventsBySowingDate from '~/backendlib/crop/plan/reschedulePlanEventsBySowingDate';
import {
  PlanEventIndividualUpdateParamsT,
  PlanEventParamsT,
  PlanEventT,
  PlanT,
} from '~/backendlib/types';
import { updateInidividualPlanEvent } from '~/backendlib/crop/plan/updateInidividualPlanEvent';
import { findPlanById, findPlanEventById, getFormattedRange } from '~/backendlib/helpers';
import { getPlanEventsToCreate } from '~/backendlib/crop/plan/getPlanEventsToCreate';
import { createPlanEvents } from '~/backendlib/crop/plan/createPlanEvents';
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import { ACTIVITY_TYPE } from '~/backendlib/constants';

const VALIDATION_ERROR_SLUG = 'VALIDATION_ERROR';
const schemaId = '/farmbook/plans';
const permittedRoles = getUpdateRoles(schemaId);
const PlanModelApi = getModel(schemaId);

const CropModelApi = getModel('/farmbook/crop');

const extractRequestFromHttpReq = (req: any) => req.body;

ajv.addFormat('hidden', {
  type: 'any',
  validate: (hidden: any) => {
    return true; // any test that returns true/false
  },
});

ajv.addSchema(definitionsSchema);

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');

  const { id, eventPlanId }: { eventPlanId: string; id: string } = req.query as any;

  if (!id) {
    return res.status(422).json({ error: 'id required' });
  }

  if (!eventPlanId) {
    return res.status(422).json({ error: 'event Plan Id required' });
  }

  try {
    // Get user modification object from req
    const mods = extractRequestFromHttpReq(req);
    let schema;
    if (mods.category === 'crop') schema = planEventSchema;
    else if (mods.category === 'poultry') schema = poultryPlanEventSchema;
    else if (mods.category === 'landparcel') schema = landparcelPlanEventSchema;
    else if (mods.category === 'productionsystem') schema = productionsystemPlanEventSchema;
    else if (mods.category === 'poultrybatch') schema = poultryPlanEventSchema;
    else schema = aquacropPlanEventSchema;

    const validator = ajv.compile(schema);

    // todo : add validator for mod
    if (!validator(mods))
      throw new Error(
        JSON.stringify({
          message: VALIDATION_ERROR_SLUG,
          details: validator.errors,
        }),
      );

    const inputParams = await getInputParams({
      req,
      planId: id,
      eventPlanId,
      mods,
    });

    let result;

    // check if activity is sowing & start date is different from existing,
    // if then update all the dates of all plan events
    if (
      // is incoming event `plantation` activityType
      inputParams.newPlanEventObjectFromReq.activityType.toLowerCase() ===
      ACTIVITY_TYPE.PLANTATION.toLowerCase() &&
      // is incoming start date is different from existing
      inputParams.selectedPlanEvent.range.start !== inputParams.newSowingStartDate
    ) {
      result = await reschedulePlanEventsBySowingDate(inputParams);

      await updatePlannedSowingDate({
        userId: inputParams.userId,
        cropId: inputParams.plan.cropId,
        newSowingStartDate: inputParams.newSowingStartDate,
      });
    }
    // else, update then only individual event plan which is requested
    else {
      const params = getInputParamsForIndividualUpdate(inputParams);

      result = await updateInidividualPlanEvent(params);

      await createAdditionalPlanEventsIfRepeatedIsEnabled(params);
    }

    return res.status(200).json(result);
  } catch (e: unknown) {
    // eslint-disable-next-line no-console
    console.log({ e });

    if (e instanceof Error && e.message.includes(VALIDATION_ERROR_SLUG)) {
      return res.status(422).json(JSON.parse(e.message));
    }
    return res.status(500).json('Server error');
  }
};

/**
 *
 * @param param0
 */
async function getInputParams({
  req,
  planId,
  eventPlanId,
  mods,
}: {
  req: NextApiRequest;
  planId: string;
  eventPlanId: string;
  mods: PlanEventT;
}): Promise<PlanEventParamsT> {
  const orgSlug = getOrgSlug(req);

  // get user id from req
  const userId = (req as any).carbonMintUser._id;

  // Get plan
  const plan = await findPlanById(planId);

  // Get event plan
  const eventPlan = await findPlanEventById({ plan, eventPlanId });

  const { start: newSowingStartDate, end: newSowingEndDate } = getFormattedRange(mods);

  const params = {
    userId,
    plan,
    selectedPlanEvent: eventPlan,
    newPlanEventObjectFromReq: mods,
    newSowingStartDate,
    newSowingEndDate,
    orgSlug,
    ccp: mods.ccp,
    eventStatus: mods.eventStatus,
  };

  return {
    ...params,
    eventPlanToUpdate: getEventToUpdate(params),
  };
}

/**
 *
 * @param req
 * @returns string
 */
function getOrgSlug(req: NextApiRequest): string {
  const orgSlug = req.query.org;

  if (!(orgSlug && typeof orgSlug === 'string')) throw new Error('Org slug not valid');

  return orgSlug;
}

/** */
async function updatePlannedSowingDate({
  userId,
  cropId,
  newSowingStartDate,
}: {
  userId: string;
  cropId: string;
  newSowingStartDate: string;
}): Promise<boolean> {
  if (!cropId) throw new Error('Crop id not valid');
  if (!newSowingStartDate) throw new Error('newSowingStartDate not valid');
  if (!userId) throw new Error('userId not valid');

  return CropModelApi.update(cropId, { plannedSowingDate: newSowingStartDate }, userId);
}

/**
 *
 * @param inputParams
 */
function getInputParamsForIndividualUpdate(
  inputParams: PlanEventParamsT,
): PlanEventIndividualUpdateParamsT {
  return {
    userId: inputParams.userId,
    plan: inputParams.plan,
    orgSlug: inputParams.orgSlug,
    eventPlanToUpdate: getEventToUpdate(inputParams),
  };
}

/**
 *
 * @param inputParams
 * @returns
 */
function getEventToUpdate(inputParams: Omit<PlanEventParamsT, 'eventPlanToUpdate'>) {
  return {
    ...inputParams.newPlanEventObjectFromReq,
    _id: inputParams.selectedPlanEvent._id,
    range: {
      start: inputParams.newSowingStartDate,
      end: inputParams.newSowingEndDate,
    },
    userId: inputParams.userId,
  };
}

/**
 * Creating additional plan events if repeated is true
 */
async function createAdditionalPlanEventsIfRepeatedIsEnabled(
  params: PlanEventIndividualUpdateParamsT,
) {
  // NOTE: disregarding the first one as it'll contain the same as the updating plan event her,
  // and we don't want a duplicate event of that)
  const [_, ...planEvents] = getPlanEventsToCreate({
    ...params.eventPlanToUpdate,
    range: {
      start: rearrangeDateDMYToYMD(params.eventPlanToUpdate.range.start),
      end: rearrangeDateDMYToYMD(params.eventPlanToUpdate.range.end),
    },
  });

  // if no plan events additional to the original one, then no need to proceed
  if (!planEvents?.length) return;

  // create plan events if neccessary
  await createPlanEvents({
    userId: params.userId,
    orgSlug: params.orgSlug,
    planEvents,
    planId: params.plan._id,
  });
}

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPutHandler(withMongo(handler))));
