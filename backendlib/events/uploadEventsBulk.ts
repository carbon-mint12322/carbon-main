import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import * as T from '../workflow/types';
import { startWf3 } from '../workflow/engine';
import getWorkflowDef from '../../gen/workflows';
import { uploadFormFile } from '../upload/file';

const logger = makeLogger('/api/.../event/bulk-create');

const userSchemaId = `/farmbook/user`;
const userModel = getModel(userSchemaId);
const cropSchemaId = `/farmbook/crop`;
const cropModel = getModel(cropSchemaId);
const eventSchemaId = `/farmbook/event`;
const eventModel = getModel(eventSchemaId);

type EventCreateWfInput = {
  wfName: string;
  modelName: string;
  id: string;
  parsedEventData: any;
  domainObjectId: string;
  eventName: string;
};

async function startCreateEventWf(input: EventCreateWfInput, session: T.UserSession) {
  const { wfName, modelName, id, parsedEventData, domainObjectId, eventName } = input;
  const _def: T.MappedWorkflowDefinition | undefined = await getWorkflowDef(wfName);
  if (!_def) {
    throw new Error('Unknown workflow definition');
  }
  const wfDef = { ..._def, domainSchemaId: '/farmbook/event' };
  logger.info(`starting workflow ${wfDef.name} for ${wfDef.domainSchemaId}, id: ${domainObjectId}`);
  const result = await startWf3(
    wfDef,
    `/farmbook/event`,
    undefined,
    `/farmbook/${modelName}`,
    id,
    eventName,
    parsedEventData,
    session,
  );
  return result;
}

export const uploadEventsBulk = async (x: any) => {
  const { data, org, modelName, userId } = x;
  const { sheetData, domainSchemaName } = data
  const schemaName = sheetData[0]['Workflow Name'].slice(0, -9).trim();
  const excelHeaders = await import(`~/gen/excel/${schemaName}.json`);
  const sheetColumns = excelHeaders.default.columnHeaders;
  const user = await userModel.get(userId)
  const roles: string[] = user.roles[org];
  const session: any = {
    userId,
    email: user.email,
    name:
      user.personalDetails?.firstName +
      ' ' +
      (user.personalDetails?.lastName ? user.personalDetails?.lastName : ''),
    roles,
  }

  const formattedEventData = mapDataToColumns(sheetData, sheetColumns);
  return formattedEventData.map(async (event: any) => {
    const wfName = event.workflowName;
    const eventName = event.workflowName.slice(0, -9).trim()
    const crop = await cropModel.aggregate([
      { $match: { fbId: event.fbId } },
      { $addFields: { cropId: { $toString: '$_id' } } },
      { $project: { cropId: 1 } }
    ])
    const id = crop[0].cropId;
    const propToRemove = ['workflowName', 'fbId', 'cropName'];
    propToRemove.forEach(prop => delete event[prop])
    const parsedEventData = await uploadFormFile(event);
    if (!org && !(wfName && eventName && parsedEventData)) { return }
    const eventCreateWfInput: EventCreateWfInput = {
      wfName,
      modelName: domainSchemaName,
      id,
      parsedEventData,
      domainObjectId: id,
      eventName,
    };
    const res = await startCreateEventWf(eventCreateWfInput, session);
  })

};


// Helper function to map data dynamically
const mapDataToColumns = (data: any, columns: any) => {
  return data.map((item: any) => {
    const mappedItem: any = {};
    columns.forEach((column: any) => {
      if (column.child) {
        const childData: any = {};
        column.child.forEach((childColumn: any) => {
          const dataKey = Object.keys(item).find(
            key => childColumn.header == key
          );
          if (dataKey) {
            childData[childColumn.key] = item[dataKey];
          }
        });
        mappedItem[column.key] = childData;
      } else {
        const dataKey = Object.keys(item).find(
          key => column.header == key
        );
        if (dataKey) {
          mappedItem[column.key] = item[dataKey];
        }
      }
    });
    return mappedItem;
  });
};