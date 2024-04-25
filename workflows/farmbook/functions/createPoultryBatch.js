import { getModel } from '../../../backendlib/db/adapter';
import { generateLocalId } from '../../../backendlib/db/util';
import { uploadFormFile } from '../../../backendlib/upload/file';
import { createPlan } from '~/backendlib/functions/createPlan';


const schemaId = `/farmbook/poultrybatch`;
const modelApi = getModel(schemaId);
const operatorSchema = '/farmbook/collective';
const OperatorApi = getModel(operatorSchema);
const psSchema = '/farmbook/productionsystem';
const PSApi = getModel(psSchema);
const lpfSchema = '/farmbook/landparcel_farmer';
const LPFApi = getModel(lpfSchema);

const createPoultryBatch = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  logger.debug('creating poultry batch object');
  const { domainContextObjectId: operatorId } = wf;
  delete event.data.name;
  const operator = await OperatorApi.get(operatorId);
  const productionSystem = await PSApi.get(event.data.productionSystem);
  const landParcelFarmerLink = await LPFApi.getByFilter({ landParcel: productionSystem.landParcel, active: true, farmer: {$exists: true} });
  const parsedData = await uploadFormFile({ ...event.data, landParcel: productionSystem.landParcel, farmer: landParcelFarmerLink?.farmer });
  const pbInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: operatorId,
    fbId: generateLocalId(operator?.name, 'PB').concat('-').concat(event.data.batchIdName),
    status: 'Draft',
  };
  logger.debug('Creating new poultry batch in DB');
  const createResult = await modelApi.create(pbInput, session.userId);
  logger.debug('Poultry Batch object created');
  wf.domainObjectId = createResult.insertedId;
  return createResult;
};

export default createPoultryBatch;
