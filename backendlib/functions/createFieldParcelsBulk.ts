
import { generateLocalId } from '../db/util';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { createCrop } from './createCrop';
import { getCurrentMYDate } from '~/frontendlib/utils/getCurrentDMYDate';

const logger = makeLogger('/api/.../farmer/create');

const landParcelSchemaId = `/farmbook/landparcel`;
const landParcelModel = getModel(landParcelSchemaId);

const landParcelFarmerSchemaId = `/farmbook/landparcel_farmer`;
const landParcelFarmerModel = getModel(landParcelFarmerSchemaId);

const farmerSchemaId = `/farmbook/farmer`;
const farmerModel = getModel(farmerSchemaId);

const collectiveSchemaId = `/farmbook/collectives`;
const collectiveModel = getModel(collectiveSchemaId);

const fieldParcelSchemaId = `/farmbook/field`;
const fieldParcelModel = getModel(fieldParcelSchemaId);

const croppingSystemSchemaId = `/farmbook/croppingsystems`;
const croppingSystemModel = getModel(croppingSystemSchemaId);



export const createFieldParcelsBulk = async (bulkData: any, userId: string) => {
    const { landParcels, crop } = bulkData.requestData

    return landParcels.map(async (data: any) => {
        const landParcel = await landParcelModel.get(data)
        if (!landParcel || !landParcel?.map) { return }
        const collective = await collectiveModel.get(landParcel?.collective)
        const { name, areaInAcres, _id: landParcelId } = landParcel
        const fieldParcelFbId = await generateLocalId(collective.name, 'FP')
        const fieldParcelPayload: any = {
            name: `${name} Field Parcel`,
            areaInAcres,
            fieldType: "Open Field",
            landParcel: landParcelId.toString(),
            landParcelMap: true,
            fbId: fieldParcelFbId,
            collective: collective._id.toString(),
            active: true
        }
        if (landParcel && landParcel?.map) {
            fieldParcelPayload.map = landParcel.map;
            fieldParcelPayload.location = landParcel.location;
            fieldParcelPayload.calculatedAreaInAcres = landParcel?.calculatedAreaInAcres;
        }
        const createdFieldParcel = await fieldParcelModel.create(fieldParcelPayload, userId);
        const createdFieldParcelId = createdFieldParcel.insertedId.toString()
        const croppingSystemFbId = await generateLocalId(collective.name, 'CS')
        const croppingSystemPayload = {
            name: `${name}_Cropping System  ${getCurrentMYDate()}`,
            field: createdFieldParcelId,
            landParcel: landParcelId.toString(),
            collective: collective._id.toString(),
            category: "Monocropping",
            active: true,
            fbId: croppingSystemFbId,
        }
        // Create Croppping  System
        const createdCroppingSystem = await croppingSystemModel.create(croppingSystemPayload, userId);
        const createdCroppingSystemId = createdCroppingSystem.insertedId.toString()
        // Get Landparcel mapping to gather farmer
        const landParcelMapping = await landParcelFarmerModel.list({
            landParcel: landParcel?._id.toString(),
            active: true
        })
        // Check if landParcel - farmer mapping exists
        if (!landParcelMapping.length) {
            return {}
        }
        // Get Farmer
        const farmer = await farmerModel.get(landParcelMapping[0].farmer)
        const cropPayload = {
            ...crop,
            croppingSystem: createdCroppingSystemId,
            farmer: {
                id: farmer._id.toString(),
                name: `${farmer.personalDetails.firstName} ${farmer.personalDetails.lastName}`
            },
            landParcel: {
                id: landParcel?._id,
                name: landParcel?.name
            }
        }
        // Create Crop
        const createdCrop = await createCrop({
            requestData: cropPayload,
            collective: { ...collective, id: collective._id.toString() }
        },
            userId
        )
    });
};