import { getModel } from '../../../backendlib/db/adapter';
import { generateLocalId } from '../../../backendlib/db/util';
import { uploadFormFile } from '../../../backendlib/upload/file';

const pbSchemaId = '/farmbook/productbatch';
const pbDbApi = getModel(pbSchemaId);

const createProductBatch = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  const { domainContextObjectId: operatorId } = wf;
  delete event.data.name;
  const parsedData = await uploadFormFile(event.data);
  const pbInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: operatorId,
    fbId: generateLocalId(session.org, 'PB'),
    status: 'Draft',
  };
  logger.debug('Creating new product batch in DB');
  const createResult = await pbDbApi.create(
    {
      ...pbInput,
    },
    session.userId,
  );
  logger.debug('Product batch object created');
  wf.domainObjectId = createResult.insertedId;
  return {};
};

export default createProductBatch;
