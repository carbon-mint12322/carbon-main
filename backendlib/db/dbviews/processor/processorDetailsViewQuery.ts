const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const PROCESSOR_SCHEMA_ID = model2schemaId('farmer');
const ProcessorApi = MongoAdapter.getModel(PROCESSOR_SCHEMA_ID);

export const processorDetailsViewQuery = async (processorId: any) => {
  const dbResult = await ProcessorApi.aggregate([
    { $match: { _id: new ObjectId(processorId) } },
    { $addFields: { processorId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('landparcel_farmers'),
        localField: 'processorId',
        foreignField: 'processor',
        pipeline: [{ $match: { active: true } }],
        as: 'landParcelProcessors',
      },
    },
    {
      $addFields: {
        landParcelProcessors: {
          $map: {
            input: '$landParcelProcessors',
            in: {
              landParcel: {
                $toObjectId: '$$this.landParcel',
              },
              own: '$$this.own',
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'landParcelProcessors.landParcel',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'landParcels',
      },
    },
    {
      $lookup: {
        from: model2collection('agents'),
        let: {
          agentsIds: {
            $map: { input: '$agents', as: 'agent', in: { $toObjectId: '$$agent' } },
          },
        },
        pipeline: [
          {
            $match: {
              $expr: { $ne: ['$$agentsIds', null] },
            },
          },
          { $match: { $expr: { $in: ['$_id', '$$agentsIds'] } } },
          {
            $project: {
              _id: 1,
              personalDetails: 1,
            },
          },
        ],
        as: 'agentsDetails',
      },
    },
    {
      $project: {
        fbId: 1,
        processorId: 1,
        personalDetails: 1,
        personalOrgDetails: 1,
        processingExperience: 1,
        operatorDetails: 1,
        bankDetails: 1,
        documents: 1,
        gender: 1,
        dob: 1,
        status: 1,
        statusNotes: 1,
        validationWorkflowId: 1,
        landParcelProcessors: 1,
        agents: 1,
        agentsDetails: 1,
        landParcels: { _id: 1, name: 1, surveyNumber: 1, address: 1, areaInAcres: 1 },
        osps: 1,
        processorSchemes: 1,
        inspectionDetails: 1,
      },
    },
  ]);
  // Massage the output to the desired format
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item.processorId,
      processorSchemes: item.processorSchemes?.map((s: any) => ({ ...s, id: s._id })),
      inspectionDetails: item.inspectionDetails?.map((fi: any) => ({
        ...fi,
        id: fi._id,
      })),
      landParcels: item.landParcels?.map((l: any) => ({
        ...l,
        id: l._id,
        own: item.landParcelProcessors?.filter(
          (lpf: any) => l._id.toString() === lpf.landParcel.toString(),
        )[0].own,
      })),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in processorDetailsViewQuery:postProcess', e);
  }
};
