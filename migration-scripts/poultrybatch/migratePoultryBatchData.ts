import { getModel } from '~/backendlib/db/adapter';

const schemaId = `/farmbook/poultrybatch`;
const modelApi = getModel(schemaId);

const migratePoultryBatchData = async () => {
    const pbs = await modelApi.list({});
    pbs.map(async (pb: any) => {
        try {
            const mods = {
                landParcel: pb.landParcel.id,
                farmer: pb.farmer.id
            }
            await modelApi.update(pb._id, mods, '');
        } catch (e) {
            console.error('Error migrating poultry batch - ', pb._id);
        }
        
    })
}

export default migratePoultryBatchData;