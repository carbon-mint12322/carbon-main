import { NextApiRequest, NextApiResponse } from 'next';

import { getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';

import PlanEventSchema from '~/gen/jsonschemas/planEvent.json';
import { httpPutHandler } from '~/backendlib/middleware/put-handler';
import { ObjectId } from 'mongodb';
import { String } from 'lodash';

const VALIDATION_ERROR_SLUG = 'VALIDATION_ERROR';
const schemaId = '/farmbook/plans';
const permittedRoles = getUpdateRoles(schemaId);
const PlanModelApi = getModel(schemaId);

const ALLOWED_STATUSES = PlanEventSchema.properties.eventStatus.enum;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const { id }: { id: string } = req.query as any;

    if (!id) {
      return res.status(422).json({ error: 'id required' });
    }

    const {
      eventPlanIds,
      payload,
    }: {
      eventPlanIds?: string[];
      payload?: { eventStatus?: typeof ALLOWED_STATUSES[number] };
    } = req.body as any;

    const userId = (req as any)?.carbonMintUser?._id?.toString();

    if (!eventPlanIds) {
      return res.status(422).json({ error: 'event Plan Id(s) required' });
    }

    if (!payload) {
      return res.status(422).json({ error: 'payload is required' });
    }

    const payloadToUpdate: Record<string, any> = {};

    // Only adding if payload is valid
    if (payload?.eventStatus) {
      // todo : add validator for mod
      if (!ALLOWED_STATUSES.includes(payload.eventStatus))
        throw new Error(
          JSON.stringify({
            message: VALIDATION_ERROR_SLUG,
            details: { error: 'eventStatus not valid' },
          }),
        );

      payloadToUpdate['eventStatus'] = payload.eventStatus;
    }

    //
    const formattedEventPlanIds = eventPlanIds.map((eventPlanId) => {
      // To support old plan events, who might have number as _ids
      if (Number(eventPlanId) >= 0) return Number(eventPlanId);

      //Convert to string if ObjectId since Nested Document Id is string
      return ObjectId.isValid(eventPlanId) ? eventPlanId.toString() : eventPlanId;
    });

    //
    const singleUpdateFunc = async (eventPlanId: string | number) => {
      return PlanModelApi.updateNestedDoc(
        id,
        'events',
        { _id: eventPlanId },
        payloadToUpdate,
        userId,
      );
    };

    //
    const result = await Promise.all(formattedEventPlanIds.map(singleUpdateFunc));

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

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPutHandler(withMongo(handler))));
