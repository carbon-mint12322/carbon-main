import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { createPlan } from './createPlan';
import { ObjectId } from 'mongodb';

const logger = makeLogger('/api/.../crop/create');

const schemaId = `/farmbook/crop`;
const modelApi = getModel(schemaId);
const masterCropSchema = '/farmbook/mastercrop';
const MasterCropApi = getModel(masterCropSchema);
const csSchema = '/farmbook/croppingsystem';
const CSApi = getModel(csSchema);
const plotSchema = '/farmbook/plot';
const PlotApi = getModel(plotSchema);

export const createCrop = async (data: any, userId: string) => {

  let createRequest = data.requestData;

  if (!(createRequest.croppingSystem || createRequest.plot)) {
    throw new Error(
      'A cropping system or a plot needs to be selected to create a crop. Please select one.'
    );
  }

  if (createRequest.masterCrop) {
    const masterCrop = await MasterCropApi.getByFilter({
      _id: new ObjectId(createRequest.masterCrop),
    });

    // Remove _id and active fields from masterCrop
    const { _id, active, collective, ...masterCropFields } = masterCrop;

    // Add remaining fields to newCreateRequest.cropInfo
    createRequest = {
      ...createRequest,
      ...masterCropFields,
      name: masterCropFields.cropName,
      masterCropName: masterCropFields.name,
    };
  }
  // get field from cropping system or plot
  const croppingSystem = await CSApi.getByFilter({
    _id: new ObjectId(createRequest.croppingSystem),
  });
  const plot = await PlotApi.getByFilter({ _id: new ObjectId(createRequest.plot) });

  const parsedData = await uploadFormFile(createRequest);

  const cropInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    field: croppingSystem ? croppingSystem?.field : plot?.field,
    fbId: generateLocalId(data.collective.name, 'CP').concat(createRequest.cropTag ? '-' : '').concat(createRequest.cropTag ? createRequest.cropTag : ''),
  };
  logger.debug('Creating new crop in DB');
  const createResult = await modelApi.create(cropInput, userId);
  logger.debug('Crop object created');

  await createPlan(
    createRequest.pop,
    'pop',
    createResult.insertedId.toString(),
    'crop',
    createRequest.plannedSowingDate,
    userId,
    data.collective.slug,
    schemaId,
  );

  return createResult;
};
