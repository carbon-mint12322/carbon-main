import { getModel } from '../db/adapter';

const schemaId = `/farmbook/product`;
const modelApi = getModel(schemaId);

export const listProducts = (filter = {}, collectiveId?: string, options?: any) =>
    modelApi.aggregate([
        { $match: { ...filter, collective: collectiveId } },
        { $addFields: { sortDate: { $toDate: '$createdAt' } } },
        { $sort: { sortDate: -1 } },
    ]);