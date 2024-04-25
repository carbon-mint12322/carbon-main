import { generateLocalId } from '../db/util';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';

const logger = makeLogger('/api/.../farmer/create');

const schemaId = `/farmbook/farmer`;
const modelApi = getModel(schemaId);
const userSchemaId = `/farmbook/user`;
const userModelApi = getModel(userSchemaId);

export const createProcessorsBulk = async (bulkData: any, userId: string) => {
  return bulkData.requestData.map(async (data: any) => {
    const formatedProcessorData = {
      personalDetails: {
        firstName: data.firstName,
        lastName: data.lastName,
        fathersHusbandsName: data.fathersHusbandsName,
        primaryPhone: data.primaryPhone ? '+91' + data.primaryPhone : 'NA',
        email: data.email,
        address: {
          mandal: data.mandal,
          village: data.village,
          state: data.state,
          pincode: data.pincode.toString() || '',
        },
        identityDetails: {
          identityNumber: data.identityNumber,
          identityDocument: 'Aadhar',
        },
      },
      processingExperience: data.processingExperience,
      gender: data.gender,
      dob: data.dob,
      operatorDetails: {
        processorID: data.processorID,
        joiningDate: data.joiningDate,
      },
      bankDetails: {
        name: data.bankName,
        branch: data.branch,
        accountNumber: data.accountNumber,
        ifsc: data.ifsc,
      },
    };
    const processorInput = {
      ...formatedProcessorData,
      collectives: [bulkData.collective.id],
      fbId: generateLocalId(bulkData.collective.name, 'FR'),
      status: 'Draft',
      type: 'Processor',
    };
    logger.debug('Creating new user for the processor in DB');
    const userResult = await userModelApi.create(
      {
        personalDetails: processorInput.personalDetails,
        roles: { [bulkData.collective.slug]: ['PROCESSOR'], farmbook: ['PROCESSOR'] },
        status: 'Draft',
      },
      userId,
    );
    logger.debug('Processor user object created');
    logger.debug('Creating new processor in DB');
    const createResult = await modelApi.create(
      {
        ...processorInput,
        userId: userResult.insertedId.toString(),
      },
      userId,
    );
    logger.debug('Processor object created');
    return createResult;
  });
};
