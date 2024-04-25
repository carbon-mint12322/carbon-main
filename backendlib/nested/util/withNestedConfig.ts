import { NextApiRequest, NextApiResponse } from 'next';
import { Handler } from '~/backendlib/types';
import getConfigFromReq from './getConfigFromReq';
import { withPermittedRoles } from '~/backendlib/rbac';
import { getRoles } from '~/backendlib/util/getRoles';

const withNestedConfig =
  (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { schema } = await getConfigFromReq(req);

      const permittedRoles = getRoles(schema, req.method);

      const wrap = withPermittedRoles(permittedRoles);
      await handler(req, res);
    } catch (err) {
      console.log({ err });

      return res.status(500).send({ msg: 'Server Error on nested config' });
    }
  };

export default withNestedConfig;
