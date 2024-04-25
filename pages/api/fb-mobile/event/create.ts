// Generated code
import formidable from 'formidable';

import { NextApiRequest, NextApiResponse } from 'next';
import { getEventCreateRoles, withPermittedRoles } from '~/backendlib/rbac';

import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';

const schemaId = `/farmbook/event`;
const permittedRoles = getEventCreateRoles(schemaId);

import { createFarmerSubEvent } from '../../../../backendlib/functions/createFarmerSubmission';
import { findSessionUserFromRequest } from '~/backendlib/middleware/with-auth-api';

const formidableConfig = {
  keepExtensions: true,
  allowEmptyFiles: true,
  multiples: true,
};

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0],
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept({ fields, files });
    });
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  try {
    const user = await findSessionUserFromRequest(req, res);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const parsed = await formidablePromise(req, {
      ...formidableConfig,
    });
    if (!parsed.files.image) {
      return res.status(401).json({ message: 'At least 1 image file needs to be uploaded' });
    }
    if (!parsed.fields.imageMeta) {
      return res.status(401).json({ message: 'Missing image metadata' });
    }
    if (parsed.files.audio) {
      if (!parsed.fields.audioMeta) {
        return res.status(401).json({ message: 'Missing audio metadata' });
      }
    }
    if (!parsed.fields.ts) {
      return res.status(401).json({ message: 'Missing timestamp' });
    }
    if (!parsed.fields.lat || !parsed.fields.lng) {
      return res.status(401).json({ message: 'Missing location' });
    }
    res.setHeader('Content-Type', 'application/json');
    const result = await createFarmerSubEvent(parsed, user?._id.toString());
    if (result == false) {
      res.status(400).json({ message: 'event with mobileId already exists!' });
    } else {
      res.status(200).json(result);
    }
  } catch (error: any) {
    console.log('ERROR in event creation from mobile - ', error);
    res.status(500).json({ message: JSON.parse(error.message) });
  }
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default wrap(withDebug(httpPostHandler(withMongo(handler))));

export const config = {
  api: {
    bodyParser: false,
  },
};
