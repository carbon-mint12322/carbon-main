import { NextApiRequest, NextApiResponse } from 'next';
import Ajv from 'ajv';

import withDebug from '~/backendlib/middleware/with-debug';
import withMongo from '~/backendlib/middleware/with-mongo';
import { AllRoles, withPermittedRoles } from '~/backendlib/rbac';

import type { Device, IDbUser } from '~/backendlib/middleware/adapters/types';
import { getModel } from '~/backendlib/db/adapter';
import { httpPutHandler } from '~/backendlib/middleware/put-handler';

// Initializing AJV
const ajv = new Ajv();

// Enforces role check
const wrap = withPermittedRoles(AllRoles);

// initating userApi
const UserSchemaId = '/farmbook/users';
const UserApi = getModel(UserSchemaId);

//
export default withDebug(wrap(httpPutHandler(withMongo(putUserHandler))));

//  A put request which has {deviceType, deviceToken} in body,
// appends the token if its unique to deviceType
async function putUserHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);

    // Validation

    const userSchema = {
      type: 'object',
      properties: {
        device: {
          type: 'object',
          properties: {
            info: { type: 'string' },
            fcmToken: { type: 'string' },
          },
          required: ['info', 'fcmToken'],
        },
      },
      additionalProperties: false,
    };

    const valid = ajv.validate(userSchema, req.body);

    // Rejecting request on validation fail
    if (!valid) return res.status(422).json(ajv.errors);

    // Validation End

    // Update devices only when device object is not empty
    if ('device' in req.body) {
      await updateOrAddDeviceForUser({ userId, data: req.body.device });
    }

    return res.status(201).send('Updated.');
  } catch (error) {
    console.log(error, ' <=== Error while updating user from mobile');
    return res.status(500).send({ message: 'Error while updating user.' });
  }
}

// Get authenticated user _id from mongo to update device tokens
function getAuthenticatedUserId(req: NextApiRequest) {
  // Change this to the authenticated user
  const userId = (req as any)?.carbonMintUser?._id?.toString() ?? null;

  if (!userId) throw new Error('User not valid');

  return userId;
}

// Update devices for user
async function updateOrAddDeviceForUser({
  userId,
  data,
}: {
  userId: string;
  data: any;
}): Promise<boolean> {
  const devicesParamName = 'devices';
  type DeviceUpdateOrAddParamT = { [key in typeof devicesParamName]: Device };

  const { info, fcmToken } = data;

  const updateOrAddDevices = async (device: DeviceUpdateOrAddParamT) => {
    return UserApi.addUnique(userId, device);
  };

  await updateOrAddDevices({ devices: { info, fcmToken } });

  return true;
}
