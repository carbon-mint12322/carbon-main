import { NextApiRequest, NextApiResponse } from 'next';

import { getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';

const Ajv = require('ajv');
const ajv = new Ajv();

import planEventSchema from '~/gen/jsonschemas/planEvent.json';
import { getPlanEventsToCreate } from '~/backendlib/crop/plan/getPlanEventsToCreate';
import { createPlanEvents } from '~/backendlib/crop/plan/createPlanEvents';

const VALIDATION_ERROR_SLUG = 'VALIDATION_ERROR';
const schemaId = '/farmbook/plans';
const permittedRoles = getUpdateRoles(schemaId);
const modelApi = getModel(schemaId);

const extractRequestFromHttpReq = (req: any) => req.body;

ajv.addFormat('hidden', {
  type: 'any',
  validate: (hidden: any) => {
    return true; // any test that returns true/false
  },
});

const validator = ajv.compile(planEventSchema);

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');
  const { id: planId }: { id: string } = req.query as any;
  if (!planId) {
    return res.status(400).json({ error: 'id required' });
  }

  try {
    const orgSlug = req.query.org;

    if (!(orgSlug && typeof orgSlug === 'string')) throw new Error('Org slug not valid');

    const mods = extractRequestFromHttpReq(req);

    // todo : add validator for mod
    // TODO: add validation back
    // if (!validator(mods)) {
    //   throw new Error(VALIDATION_ERROR_SLUG, validator.errors);
    // }

    const userId = (req as any)?.carbonMintUser?._id?.toString();

    // Getting events to create
    const planEvents = getPlanEventsToCreate(mods);

    const { result, planEventIds } = await createPlanEvents({
      userId,
      orgSlug,
      planEvents,
      planId,
    });

    return res.status(200).json({ ...result, eventPlanIds: planEventIds });
  } catch (e: unknown) {
    // eslint-disable-next-line no-console
    console.error(e);
    if (e instanceof Error && e.message.includes(VALIDATION_ERROR_SLUG)) {
      return res.status(422).json('Validation failed.');
    }
    return res.status(500).json('Server error');
  }
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPostHandler(withMongo(handler))));
