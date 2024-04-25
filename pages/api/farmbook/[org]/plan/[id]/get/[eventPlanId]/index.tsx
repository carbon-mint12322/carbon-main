import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getModel } from '~/backendlib/db/adapter';
import { httpGetHandler, withMongo } from '~/backendlib/middleware';
import withDebug from '~/backendlib/middleware/with-debug';
import { getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';

const schemaId = '/farmbook/plans';
const permittedRoles = getUpdateRoles(schemaId);
const PlanModelApi = getModel(schemaId);

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);


async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        res.setHeader('Content-Type', 'application/json');

        const { id, eventPlanId } = req.query as any;

        if (!id) {
            return res.status(422).json({ error: 'Plan Id required' });
        }

        if (!eventPlanId) {
            return res.status(422).json({ error: 'Event Plan Id required' });
        }

        // get parent model
        const row = (await PlanModelApi.get(id)) ?? null;

        // throw error if parent not found
        if (!row?._id) throw new Error('Plan not found');

        // get children object
        const childrenArray = row['events'];

        // get object
        const child = childrenArray.find(
            (child: { _id: ObjectId }) => child?._id?.toString() === eventPlanId.toString(),
        );

        return res.json(child);

    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);

        return res.status(500).json('Server error');
    }
}

export default withDebug(httpGetHandler(withMongo(getHandler)));
