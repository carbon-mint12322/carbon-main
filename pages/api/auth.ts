// Generated code - List API
import { NextApiRequest, NextApiResponse } from 'next';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';
import { findSessionUserFromRequest } from '~/backendlib/middleware/with-auth-api';
import { getAuthAdapter } from '~/backendlib/middleware/with-auth-api';
import { getFirebaseAdmin } from '~/backendlib/middleware/verify-token';
import { IAuthRecord } from '~/backendlib/middleware/adapters/types';
import { agentDetailsViewQuery } from '~/backendlib/db/dbviews/agent/agentDetailsViewQuery';
import validateSession from 'auth/validate-session-be';
import getAppName from '~/backendlib/locking/getAppName';

const schemaId = '/farmbook/users';
const modelApi = getModel(schemaId);

const schemaAgentId = '/farmbook/agent';
const modelAgentApi = getModel(schemaAgentId);

export const listagents = (filter = {}, options?: any) => modelAgentApi.list(filter, options);

export const getUser = (filter = {}, options?: any) => modelApi.getByFilter(filter, options);

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const authAdapter = getAuthAdapter();
  // const token = await authAdapter.findToken(req);
  // const decodedToken: IAuthRecord | null = await authAdapter.verifyIdToken(token);

  const params = req.query;
  const from = params.from || 'web';

  const session = await validateSession(req, res);
  let result = await authAdapter.findDbUser(session.user);
  var newToken, agentDetails;
  var allow: any = {};
  const availableRoles = ['AGENT', 'FARMER', 'ADMIN', 'FIELD_OFFICER'];
  if (result) {
    (result?.roles[getAppName()] || []).map((role) => {
      allow[role] = !availableRoles.includes(role);
    });

    for (let role of result?.roles[getAppName()] || []) {
      switch (role) {
        case 'AGENT': {
          agentDetails = await agentDetailsViewQuery(result._id.toString());
          if (
            agentDetails &&
            agentDetails.collectives &&
            Array.isArray(agentDetails.collectives) &&
            agentDetails.collectives.length > 0
          ) {
            allow[role] = true;
          }
          break;
        }
        case 'FARMER': {
          allow[role] = from == 'mobile';
          break;
        }
        case 'ADMIN': {
          allow[role] = false;
          break;
        }
        case 'FIELD_OFFICER': {
          allow[role] = from == 'mobile';
          break;
        }
        case 'PROCESSOR': {
          allow[role] = from == 'mobile';
          break;
        }
        default: {
          allow[role] = false;
          break;
        }
      }
    }
  }

  let finalAllow = false;

  if (Object.keys(allow).length > 0) {
    let hasTrue = false;
    for (let role in allow) {
      if (allow[role]) {
        hasTrue = true;
        break;
      }
    }

    if (hasTrue) {
      finalAllow = true;
      // await getFirebaseAdmin()
      //   .auth()
      //   .setCustomUserClaims(decodedToken?.uid || '', { ...decodedToken, user: result });
    }
  }

  res.setHeader('Content-Type', 'application/json');

  res.status(200).json({
    allow: finalAllow,
    operator: agentDetails?.collectives?.[0]?.slug,
  });
};

export default withDebug(httpGetHandler(withMongo(handler)));
