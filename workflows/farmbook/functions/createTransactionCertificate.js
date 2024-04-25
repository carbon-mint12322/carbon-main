import { getModel } from '../../../backendlib/db/adapter';
import { generateLocalId } from '../../../backendlib/db/util';
import { uploadFormFile } from '../../../backendlib/upload/file';

const tcSchemaId = '/farmbook/transactioncertificate';
const tcDbApi = getModel(tcSchemaId);

const createTransactionCertificate = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  const { domainContextObjectId: operatorId } = wf;
  delete event.data.name;
  const parsedData = await uploadFormFile(event.data);
  const tcInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: operatorId,
    fbId: generateLocalId(session.org, 'TC'),
    status: 'Draft',
  };
  logger.debug('Creating new transaction certificate in DB');
  const createResult = await tcDbApi.create(
    {
      ...tcInput,
    },
    session.userId,
  );
  logger.debug('Transaction Certificate object created');
  wf.domainObjectId = createResult.insertedId;
  return {};
};

export default createTransactionCertificate;
