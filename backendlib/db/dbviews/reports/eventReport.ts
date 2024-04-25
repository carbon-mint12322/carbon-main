import { model2collection, model2schemaId } from '../util';
import MongoAdapter from '../../MongoAdapter';
import { parseISODateStringToDateString } from '~/backendlib/utils';
import { stringDateFormatter } from '~/utils/dateFormatter';

const EVENT_SCHEMA_ID = model2schemaId('event');
const EventApi = MongoAdapter.getModel(EVENT_SCHEMA_ID);

export const eventReportViewQuery = async (
  eventType: string,
  dateRange?: {
    start: string;
    end: string;
  },
  filter = {},
) => {
  const dbResult = await EventApi.aggregate([
    { $addFields: { lpObjectId: { $toObjectId: '$landParcelId' } } },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'lpObjectId',
        foreignField: '_id',
        as: 'landparcel',
      },
    },
    { $addFields: { cropObjectId: { $toObjectId: '$cropId' } } },
    {
      $lookup: {
        from: model2collection('crops'),
        localField: 'cropObjectId',
        foreignField: '_id',
        as: 'crop',
      },
    },
    { $addFields: { fieldObjectId: { $toObjectId: '$fieldId' } } },
    {
      $lookup: {
        from: model2collection('fields'),
        localField: 'fieldObjectId',
        foreignField: '_id',
        as: 'fieldDetails',
      },
    },
    {
      $match: {
        name: eventType,
        ...(dateRange
          ? {
              $expr: {
                $and: [
                  {
                    $gte: [
                      '$details.durationAndExpenses.startDate',
                      parseISODateStringToDateString(dateRange.start),
                    ],
                  },
                  {
                    $lte: [
                      '$details.durationAndExpenses.endDate',
                      parseISODateStringToDateString(dateRange.end),
                    ],
                  },
                ],
              },
            }
          : {}),
        ...filter,
      },
    },
    {
      $project: {
        details: {
          solarDryer: {
            id: 0,
          },
          compostingUnit: {
            id: 0,
          },
        },
      },
    },
  ]);
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map(({ landparcel, ...item }: any) => ({
      ...item,
      landParcelName: landparcel?.[0]?.name,
      createdAt: stringDateFormatter(item.createdAt),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in eventReportViewQuery:postProcess', e);
  }
};
