import { NextApiRequest, NextApiResponse } from 'next';
import { getCreateRoles, getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';

import * as T from '~/backendlib/workflow/types';

import { startWf3 } from '~/backendlib/workflow/engine';
import makeLogger from '~/backendlib/logger';
import getWorkflowDef from '~/gen/workflows';

import { uploadFormFile } from '~/backendlib/upload/file';
import {getModel} from "~/backendlib/db/adapter";

const schemaId = T.wfInstSchemaId;
const logger = makeLogger(schemaId);
// This seems wrong...
const permittedRoles = getCreateRoles(schemaId);

const eventSchema = '/farmbook/event';
const eventDBApi = getModel(eventSchema);

const extractRequestFromHttpReq = (req: any) => req.body;

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
  res.setHeader('Content-Type', 'application/json');
  try {
    const inputBody = extractRequestFromHttpReq(req);
    //   const { org, modelName, id }: { org: string; modelName: string; id: string } = req.query;
    const org = req.query.org as string;
    const modelName = req.query.modelName as string; //e.g. crop
    const id = req.query.id as string; // e.g. cropId
    const events = await eventDBApi.list({cropId: id, active: true, category: 'Crop', lifecycleWorkflowId: {$exists: false}});
    const eventData = {notes: 'Migrating event to new lifecycle workflow.'};
    if (!org) {
      res.status(400).json({error: 'org required'});
    }
    const session = makeWfSession(req);
    if (!session) {
      res.status(403).json({});
    }
    for (const event of events) {
      const wfName = event.name === 'updatedHarvestingEvent' ? 'harvestingEventLifecycle' : event.name + 'Lifecycle';
      const domainObjectId = event._id.toString();

      const eventCreateWfInput: EventCreateWfInput = {
        wfName,
        modelName,
        id,
        parsedEventData: eventData,
        domainObjectId,
        eventName: 'migrate',
      };
      await startCreateEventWf(eventCreateWfInput, session);
      logger.info('Workflow started');
    }
  } catch(e) {
    console.log('ERROR --- ',e);
  }

  res.status(200).json({});
}

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPostHandler(withMongo(handler))));

type EventCreateWfInput = {
  wfName: string;
  modelName: string;
  id: string;
  parsedEventData: any;
  domainObjectId: string;
  eventName: string;
};

async function startCreateEventWf(input: EventCreateWfInput, session: T.UserSession) {
  const { wfName, modelName, id, parsedEventData, domainObjectId, eventName } = input;
  const _def: T.MappedWorkflowDefinition | undefined = await getWorkflowDef(wfName);
  if (!_def) {
    throw new Error('Unknown workflow definition');
  }
  const wfDef = { ..._def, domainSchemaId: '/farmbook/event' };
  logger.info(`starting workflow ${wfDef.name} for ${wfDef.domainSchemaId}, id: ${domainObjectId}`);
  const result = await startWf3(
    wfDef,
    `/farmbook/event`,
      domainObjectId,
    `/farmbook/${modelName}`,
    id,
    eventName,
    parsedEventData,
    session,
  );
}

function makeWfSession(req: NextApiRequest) {
  const org = req.query.org as string;
  const user: any = (req as any).carbonMintUser;
  const userId = user._id.toString();
  const roles: string[] = user.roles[org];
  logger.debug('user', user, 'org', org);
  if (!user) {
    return null;
  }
  if (!(roles && roles.length)) {
    return null;
  }
  const session: any = {
    userId,
    email: user.email,
    name:
      user.personalDetails?.firstName +
      ' ' +
      (user.personalDetails?.lastName ? user.personalDetails?.lastName : ''),
    roles,
  };
  return session;
}
