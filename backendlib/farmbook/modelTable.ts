import cowSchema from '~/gen/jsonschemas/cow.json';
import addCowSchema from '~/gen/jsonschemas/add_cow.json';
import goatSchema from '~/gen/jsonschemas/goat.json';
import addGoatSchema from '~/gen/jsonschemas/add_goat.json';
import sheepSchema from '~/gen/jsonschemas/sheep.json';
import addSheepSchema from '~/gen/jsonschemas/add_sheep.json';
import landownerSchema from '~/gen/jsonschemas/landowner.json';
import schemepopSchema from '~/gen/jsonschemas/schemepop.json';
import schemeSchema from '~/gen/jsonschemas/scheme.json';
import poultrySchema from '~/gen/jsonschemas/poultrybatch.json';
import addPoultrySchema from '~/gen/jsonschemas/add_poultry.json';
import aquacropSchema from '~/gen/jsonschemas/aquacrop.json';
import addAquaCropSchema from '~/gen/jsonschemas/add_aquacrop.json';
import farmerSchema from '~/gen/jsonschemas/farmer.json';
import addFarmerSchema from '~/gen/jsonschemas/add_farmer.json';
import addProcessorSchema from '~/gen/jsonschemas/add_processor.json';
import certificationBodySchema from '~/gen/jsonschemas/certificationbody.json';
import addCertificationBodySchema from '~/gen/jsonschemas/add_certificationbody.json';
import collectiveSchema from '~/gen/jsonschemas/collective.json';
import addCollectiveSchema from '~/gen/jsonschemas/add_collective.json';
import landparcelSchema from '~/gen/jsonschemas/landparcel.json';
import addLandparcelSchema from '~/gen/jsonschemas/landparcel_basicinfo.json';
import landparcelFarmerSchema from '~/gen/jsonschemas/landparcel_farmer.json';

import addLandparcelFarmerSchema from '~/gen/jsonschemas/landparcel_addfarmer.json';
import addLandparcelProcessorSchema from '~/gen/jsonschemas/landparcel_addprocessor.json';
import cropSchema from '~/gen/jsonschemas/crop.json';
import addCropSchema from '~/gen/jsonschemas/add_crop.json';
import fieldSchema from '~/gen/jsonschemas/field.json';
import addFieldSchema from '~/gen/jsonschemas/landparcel_fields.json';
import eventSchema from '~/gen/jsonschemas/event.json';
import croppingSystemSchema from '~/gen/jsonschemas/croppingsystem.json';
import addCroppingSystemSchema from '~/gen/jsonschemas/add_croppingsystem.json';
import plotSchema from '~/gen/jsonschemas/plot.json';
import addPlotSchema from '~/gen/jsonschemas/add_plot.json';
import masterCropSchema from '~/gen/jsonschemas/mastercrop.json';
import addMasterCropSchema from '~/gen/jsonschemas/add_mastercrop.json';
import addOrganicSystemPlanSchema from '~/gen/jsonschemas/organicSystemPlan.json';
import addCollectiveTransactionCertSchema from '~/gen/jsonschemas/add_collectivetransactioncert.json';
import popSchema from '~/gen/jsonschemas/pop.json';
import addPopSchema from '~/gen/jsonschemas/add_pop.json';
import poultryPopSchema from '~/gen/jsonschemas/poultrypop.json';

import addPoultryPopSchema from '~/gen/jsonschemas/add_poultrypop.json';
import aquaPopSchema from '~/gen/jsonschemas/aquapop.json';
import addAquaPopSchema from '~/gen/jsonschemas/add_aquapop.json';
import processingSystemSchema from '~/gen/jsonschemas/processingsystem.json';
import addProcessingSystemSchema from '~/gen/jsonschemas/add_processingsystem.json';
import productionSystemSchema from '~/gen/jsonschemas/productionsystem.json';
import addProductionSystemSchema from '~/gen/jsonschemas/add_productionsystem.json';
import productSchema from '~/gen/jsonschemas/product.json';
import addProductSchema from '~/gen/jsonschemas/add_product.json';
import productBatchSchema from '~/gen/jsonschemas/productbatch.json';
import addProductBatchSchema from '~/gen/jsonschemas/add_productBatch.json';
import taskSchema from '~/gen/jsonschemas/task.json';
import userSchema from '~/gen/jsonschemas/user.json';
import collectiveUserSchema from '~/gen/jsonschemas/collectiveUser.json';
import certificationbodyUserSchema from '~/gen/jsonschemas/certificationbodyUser.json';
import addUserSchema from '~/gen/jsonschemas/add_user.json';
import notificationSchema from '~/gen/jsonschemas/notification.json';
import plantHealthSchema from '~/gen/jsonschemas/plantHealth.json';

import { getCreateRoles, getListRoles, getGetRoles, getUpdateRoles } from '../rbac';
import { cowListViewQuery } from '../db/dbviews/cow/cowListViewQuery';
import { farmerListViewQuery } from '../db/dbviews/farmer/farmerListViewQuery';
import { schemeDetailsViewQuery } from '../db/dbviews/scheme/schemeDetailsViewQuery';
import { farmerDetailsViewQuery } from '../db/dbviews/farmer/farmerDetailsViewQuery';
import { processorListViewQuery } from '../db/dbviews/processor/processorListViewQuery';
import { processorDetailsViewQuery } from '../db/dbviews/processor/processorDetailsViewQuery';
import { certificationbodyDetailsViewQuery } from '../db/dbviews/certificationbody/certificationbodyDetailsViewQuery';
import { collectiveDetailsViewQuery } from '../db/dbviews/collective/collectiveDetailsViewQuery';
import { landParcelDetailsViewQuery } from '../db/dbviews/landparcel/landParcelDetailsViewQuery';
import { landParcelListMapViewQuery } from '../db/dbviews/landparcel/landParcelListMapViewQuery';
import { collectiveTransactionCertDetailsViewQuery } from '../db/dbviews/collective/collectiveTransactionCertDetailsViewQuery';
import { landParcelListViewQuery } from '../db/dbviews/landparcel/landParcelListViewQuery';
import { getModel } from '../db/adapter';
import { uploadFormFile } from '../upload/file';
import { createLandParcel } from '../functions/createLandParcel';
import { createProductionSystem } from '../functions/createProductionSystem';
import { updateLandParcel } from '../functions/updateLandParcel';
import { linkLandParcelFarmer } from '../functions/linkLandParcelFarmer';
import { cropNameList } from '../db/dbviews/crop-name';
import { aquacropNameList } from '../db/dbviews/aqua-crop-name';
import { cropTypeList } from '../db/dbviews/crop-type';
import { croppingSystemDetailsViewQuery } from '../db/dbviews/croppingsystem/croppingSystemDetailsViewQuery';
import { createCroppingSystem } from '../functions/createCroppingSystem';
import { createOrganicSystemPlan } from '../functions/createOrganicSystemPlan';
import { fieldDetailsViewQuery } from '../db/dbviews/field/fieldlDetailsViewQuery';
import { fieldListViewQuery } from '../db/dbviews/field/fieldListViewQuery';
import { createField } from '../functions/createField';
import { eventDetailsViewQuery } from '../db/dbviews/event/eventDetailsViewQuery';
import { cowDetailsViewQuery } from '../db/dbviews/cow/cowDetailsViewQuery';
import { goatListViewQuery } from '../db/dbviews/goat/goatListViewQuery';
import { goatDetailsViewQuery } from '../db/dbviews/goat/goatDetailsViewQuery';
import { sheepListViewQuery } from '../db/dbviews/sheep/sheepListViewQuery';
import { sheepDetailsViewQuery } from '../db/dbviews/sheep/sheepDetailsViewQuery';
import { landownerListViewQuery } from '../db/dbviews/landowner/landownerListViewQuery';
import { landownerDetailsViewQuery } from '../db/dbviews/landowner/landownerDetailsViewQuery';
import { poultryListViewQuery } from '../db/dbviews/poultry/poultryListViewQuery';
import { poultryDetailsViewQuery } from '../db/dbviews/poultry/poultryDetailsViewQuery';
import { createPoultryBatch } from '../functions/createPoultryBatch';
import { aquacropListViewQuery } from '../db/dbviews/aquacrop/aquacropListViewQuery';
import { aquacropDetailsViewQuery } from '../db/dbviews/aquacrop/aquacropDetailsViewQuery';
import { createAquaCrop } from '../functions/createAquaCrop';
import { plotDetailsViewQuery } from '../db/dbviews/plot/plotDetailsViewQuery';
import { createPlot } from '../functions/createPlot';
import { poultryBreedNameList } from '../db/dbviews/poultry-breed-name';
import { createPop } from '../functions/createPop';
import { createSchemePOP } from '../../workflows/farmbook/functions/createSchemePOP';
import { createPoultryPop } from '../functions/createPoultryPop';
import { createAquaPop } from '../functions/createAquaPop';
import { cropListViewQuery } from '../db/dbviews/crop/cropListViewQuery';
import { cropDetailsViewQuery } from '../db/dbviews/crop/cropDetailsViewQuery';
import { createCrop } from '../functions/createCrop';
import { updateCrop } from '../functions/updateCrop';
import { updateAquaCrop } from '../functions/updateAquaCrop';
import { updatePoultryBatch } from '../functions/updatePoultryBatch';
import { generateLocalId } from '../db/util';

import { productionSystemListViewQuery } from '../db/dbviews/productionsystem/productionSystemListViewQuery';
import { productionSystemDetailsViewQuery } from '../db/dbviews/productionsystem/productionSystemDetailsViewQuery';
import { processingSystemListViewQuery } from '../db/dbviews/processingsystem/processingSystemListViewQuery';
import { processingSystemDetailsViewQuery } from '../db/dbviews/processingsystem/processingSystemDetailsViewQuery';
import { productBatchDetailsViewQuery } from '../db/dbviews/productbatch/productBatchDetailsViewQuery';
import { taskListViewQuery } from '../db/dbviews/task/taskListViewQuery';
import { taskDetailsViewQuery } from '../db/dbviews/task/taskDetailsViewQuery';
import { createTask } from '../functions/createTask';
import { createUser } from '../functions/createUser';

import { updateUser } from '../functions/updateUser';
import { createCollectiveUser } from '../functions/createCollectiveUser';
import { updateCollectiveUser } from '../functions/updateCollectiveUser';
import { createCertificationbodyUser } from '../functions/createCertificationbodyUser';
import { updateCertificationbodyUser } from '../functions/updateCertificationbodyUser';
import { listUsers } from '../functions/listUsers';
import { getUser } from '../functions/getUser';
import { listNotifications } from '../functions/listNotifications';
import { listMobileNotifications } from '../functions/listMobileNotifications';
import { updateFarmer } from '../functions/updateFarmer';
import { productBatchListViewQuery } from '../db/dbviews/productbatch/productBatchListViewQuery';
import { createFarmersBulk } from '../functions/createFarmersBulk';
import { createProcessorsBulk } from '../functions/createProcessorsBulk';
import { createLandParcelsBulk } from '../functions/createLandParcelsBulk';
import { updateEventsBulk } from '../functions/updateEventsBulk';
import { createCow } from '../functions/createCow';
import { createCollective } from '../functions/createCollective';
import { createGoat } from '../functions/createGoat';
import { createSheep } from '../functions/createSheep';
import { createMasterCrop } from '../functions/createMasterCrop';
import { collectiveListViewQuery } from '../db/dbviews/collective/collectiveListViewQuery';
import { deleteFarmer } from '../functions/deleteFarmer';
import { createFieldParcelsBulk } from '../functions/createFieldParcelsBulk';
import { getPlantHealth } from '../functions/getPlantHealth';
import { createEventsBulk } from '../functions/createEventsBulk';

import { ModelDef } from '~/frontendlib/types';
import generatedModelTable from "./modelTableDefaults";
import { listProducts } from '../functions/listProducts';
import { getMarkersForEvent } from '../functions/getMarkersForEvent';
import { updatePop } from '../functions/updatePop';

/**
 * Model definitions for org-specific models in the system.
 */
export const modelDefs: ModelDef[] = [
  {
    name: 'certificationbody',
    schema: certificationBodySchema,
    createSchema: addCertificationBodySchema,
    getQueryFn: certificationbodyDetailsViewQuery,
  },
  {
    name: 'collective',
    schema: collectiveSchema,
    createSchema: addCollectiveSchema,
    listQueryFn: collectiveListViewQuery,
    getQueryFn: collectiveDetailsViewQuery,
    createFn: createCollective,
  },
  {
    name: 'farmer',
    schema: farmerSchema,
    createSchema: addFarmerSchema,
    listQueryFn: farmerListViewQuery,
    getQueryFn: farmerDetailsViewQuery,
    updateFn: updateFarmer,
    bulkCreateFn: createFarmersBulk,
    deleteFn: deleteFarmer,
  },
  {
    name: 'processor',
    schema: addProcessorSchema,
    createSchema: addProcessorSchema,
    listQueryFn: processorListViewQuery,
    getQueryFn: processorDetailsViewQuery,
    bulkCreateFn: createProcessorsBulk,
    deleteFn: deleteFarmer,
  },
  {
    name: 'landparcel',
    schema: landparcelSchema,
    createSchema: addLandparcelSchema,
    listQueryFn: landParcelListViewQuery,
    getQueryFn: landParcelDetailsViewQuery,
    createFn: createLandParcel,
    updateFn: updateLandParcel,
    bulkCreateFn: createLandParcelsBulk,
  },
  {
    name: 'landparcel-maps',
    schema: landparcelSchema,
    listQueryFn: landParcelListMapViewQuery,
  },
  {
    name: 'landparcel-farmer',
    schema: landparcelFarmerSchema,
    createSchema: addLandparcelFarmerSchema,
    createFn: linkLandParcelFarmer,
  },
  {
    name: 'landparcel-processor',
    schema: landparcelFarmerSchema,
    createSchema: addLandparcelProcessorSchema,
    createFn: linkLandParcelFarmer,
  },
  {
    name: 'crop-name',
    schema: cropSchema,
    listQueryFn: cropNameList,
  },
  {
    name: 'aqua-crop-name',
    schema: aquacropSchema,
    listQueryFn: aquacropNameList,
  },
  {
    name: 'crop-type',
    schema: cropSchema,
    listQueryFn: cropTypeList,
  },
  {
    name: 'croppingsystem',
    schema: croppingSystemSchema,
    createSchema: addCroppingSystemSchema,
    getQueryFn: croppingSystemDetailsViewQuery,
    createFn: createCroppingSystem,
  },
  {
    name: 'field',
    schema: fieldSchema,
    createSchema: addFieldSchema,
    getQueryFn: fieldDetailsViewQuery,
    listQueryFn: fieldListViewQuery,
    createFn: createField,
    bulkCreateFn: createFieldParcelsBulk,
  },
  {
    name: 'crop',
    schema: cropSchema,
    createSchema: addCropSchema,
    getQueryFn: cropDetailsViewQuery,
    listQueryFn: cropListViewQuery,
    createFn: createCrop,
    updateFn: updateCrop,
  },
  {
    name: 'event',
    schema: eventSchema,
    createSchema: eventSchema,
    getQueryFn: eventDetailsViewQuery,
    bulkCreateFn: createEventsBulk,
    bulkUpdateFn: updateEventsBulk,
  },
  {
    name: 'cow',
    schema: cowSchema,
    createSchema: addCowSchema,
    listQueryFn: cowListViewQuery,
    getQueryFn: cowDetailsViewQuery,
    createFn: createCow,
  },
  {
    name: 'goat',
    schema: goatSchema,
    createSchema: addGoatSchema,
    listQueryFn: goatListViewQuery,
    getQueryFn: goatDetailsViewQuery,
    createFn: createGoat,
  },
  {
    name: 'sheep',
    schema: sheepSchema,
    createSchema: addSheepSchema,
    listQueryFn: sheepListViewQuery,
    getQueryFn: sheepDetailsViewQuery,
    createFn: createSheep,
  },
  {
    name: 'landowner',
    schema: landownerSchema,
    createSchema: landownerSchema,
    listQueryFn: landownerListViewQuery,
    getQueryFn: landownerDetailsViewQuery
  },
  {
    name: 'schemepop',
    schema: schemepopSchema,
    createSchema: schemepopSchema,
    createFn: createSchemePOP,

  },
  {
    name: 'scheme',
    schema: schemeSchema,
    createSchema: schemeSchema,
    getQueryFn: schemeDetailsViewQuery,
  },
  {
    name: 'poultrybatch',
    schema: poultrySchema,
    createSchema: addPoultrySchema,
    listQueryFn: poultryListViewQuery,
    getQueryFn: poultryDetailsViewQuery,
    createFn: createPoultryBatch,
    updateFn: updatePoultryBatch,
  },
  {
    name: 'aquacrop',
    schema: aquacropSchema,
    createSchema: addAquaCropSchema,
    listQueryFn: aquacropListViewQuery,
    getQueryFn: aquacropDetailsViewQuery,
    createFn: createAquaCrop,
    updateFn: updateAquaCrop,
  },
  {
    name: 'plot',
    schema: plotSchema,
    createSchema: addPlotSchema,
    getQueryFn: plotDetailsViewQuery,
    createFn: createPlot,
  },
  {
    name: 'mastercrop',
    schema: masterCropSchema,
    createSchema: addMasterCropSchema,
    createFn: createMasterCrop,
  },
  {
    name: 'transactioncertificate',
    schema: addCollectiveTransactionCertSchema,
    createSchema: addCollectiveTransactionCertSchema,
    getQueryFn: collectiveTransactionCertDetailsViewQuery,
  },
  {
    name: 'organicsystemplan',
    schema: addOrganicSystemPlanSchema,
    createSchema: addOrganicSystemPlanSchema,
    createFn: createOrganicSystemPlan,
  },
  {
    name: 'pop',
    schema: popSchema,
    createSchema: addPopSchema,
    createFn: createPop,
    updateFn: updatePop
  },
  {
    name: 'poultry-breed-name',
    schema: poultrySchema,
    getQueryFn: poultryBreedNameList,
  },
  {
    name: 'poultrypop',
    schema: poultryPopSchema,
    createSchema: addPoultryPopSchema,
    createFn: createPoultryPop,
  },
  {
    name: 'aquapop',
    schema: aquaPopSchema,
    createSchema: addAquaPopSchema,
    createFn: createAquaPop,
  },
  {
    name: 'processingsystem',
    schema: processingSystemSchema,
    createSchema: addProcessingSystemSchema,
    listQueryFn: processingSystemListViewQuery,
    getQueryFn: processingSystemDetailsViewQuery,
  },
  {
    name: 'productionsystem',
    schema: productionSystemSchema,
    createSchema: addProductionSystemSchema,
    createFn: createProductionSystem,
    listQueryFn: productionSystemListViewQuery,
    getQueryFn: productionSystemDetailsViewQuery,
  },
  {
    name: 'product',
    schema: productSchema,
    createSchema: addProductSchema,
    listQueryFn: listProducts
  },
  {
    name: 'productbatch',
    schema: productBatchSchema,
    createSchema: addProductBatchSchema,
    listQueryFn: productBatchListViewQuery,
    getQueryFn: productBatchDetailsViewQuery,
  },
  {
    name: 'task',
    schema: taskSchema,
    createSchema: taskSchema,
    listQueryFn: taskListViewQuery,
    getQueryFn: taskDetailsViewQuery,
    createFn: createTask,
  },
  {
    name: 'user',
    schema: userSchema,
    createSchema: addUserSchema,
    listQueryFn: listUsers,
    getQueryFn: getUser,
    createFn: createUser,
    updateFn: updateUser,
  },
  {
    name: 'collective-user',
    schema: collectiveUserSchema,
    createSchema: collectiveUserSchema,

    getQueryFn: getUser,
    createFn: createCollectiveUser,
    updateFn: updateCollectiveUser,
  },
  {
    name: 'certificationbody-user',
    schema: certificationbodyUserSchema,
    createSchema: certificationbodyUserSchema,

    getQueryFn: getUser,
    createFn: createCertificationbodyUser,
    updateFn: updateCertificationbodyUser,
  },
  {
    name: 'notification',
    schema: notificationSchema,
    listQueryFn: listNotifications,
  },
  {
    name: 'mobile-notifications',
    schema: notificationSchema,
    listQueryFn: listMobileNotifications,
  },
  {
    name: 'plant-health',
    schema: plantHealthSchema,
    createFn: getPlantHealth,
  },
  {
    name: 'event-markers',
    schema: eventSchema,
    createSchema: eventSchema,
    getQueryFn: getMarkersForEvent,
  },

  ...generatedModelTable,
];

function defaultListQueryFn(modelName: string) {
  const modelApi = getModelApi(modelName);
  return function (filter: any): Promise<any> {
    return modelApi.aggregate([
      { $match: { ...filter } },
      { $addFields: { sortDate: { $toDate: '$createdAt' } } },
      { $sort: { sortDate: -1 } },
    ]);;
  };
}

function defaultGetQueryFn(modelName: string) {
  const modelApi = getModelApi(modelName);
  return function (id: string): Promise<any> {
    return modelApi.get(id);
  };
}

function defaultUpdateFn(modelName: string) {
  const modelApi = getModelApi(modelName);
  return async function (id: string, mods: any, userId: string): Promise<void> {
    delete mods._id;
    const parsedData = await uploadFormFile(mods);
    return modelApi.update(id, parsedData, userId);
  };
}

function defaultCreateFn(modelName: string) {
  const modelApi = getModelApi(modelName);
  return async function (data: any, userId: string): Promise<void> {
    const createInput = {
      ...data.requestData,
      collective: data.collective.id,
      fbId: generateLocalId(data.collective.name, modelName),
      status: 'Draft',
    };
    const parsedData = await uploadFormFile(createInput);
    return modelApi.create(parsedData, userId);
  };
}

function defaultBulkCreateFn(modelName: string) {
  const modelApi = getModelApi(modelName);
  return async function (bulkData: any, userId: string): Promise<void> {
    return bulkData.map(async (data: any) => {
      const createInput = {
        ...data.requestData,
        collective: data.collective.id,
        fbId: generateLocalId(data.collective.name, modelName),
        status: 'Draft',
      };
      const parsedData = await uploadFormFile(createInput);
      return modelApi.create(parsedData, userId);
    });
  };
}

function defaultBulkUpdateFn(modelName: string) {
  const modelApi = getModelApi(modelName);
  return async function (bulkData: any, userId: string): Promise<void> {
    return bulkData.map(async (mods: any) => {
      const id = mods.id;
      delete mods.id;
      const parsedData = await uploadFormFile(mods);
      return modelApi.update(id, parsedData, userId);
    });
  };
}

function defaultDeleteFn(modelName: string) {
  const modelApi = getModelApi(modelName);
  return function (id: string, org: string, userId: string): Promise<void> {
    // TODO: Need to verify that the id being deleted belongs to the right org.
    return modelApi.remove(id);
  };
}

export function getPermittedRolesCreate(schemaId: string) {
  const defaultRoles = getCreateRoles(schemaId);
  const def = findModelDef(schemaId);
  return def?.createRoles || defaultRoles;
}

export function getPermittedRolesList(schemaId: string) {
  const defaultRoles = getListRoles(schemaId);
  const def = findModelDef(schemaId);
  return def?.updateRoles || defaultRoles;
}

export function getPermittedRolesGet(schemaId: string) {
  const defaultRoles = getGetRoles(schemaId);
  const def = findModelDef(schemaId);
  return def?.getRoles || defaultRoles;
}

export function getPermittedRolesUpdate(schemaId: string) {
  const defaultRoles = getUpdateRoles(schemaId);
  const def = findModelDef(schemaId);
  return def?.updateRoles || defaultRoles;
}

function findModelDef(name: string): ModelDef | undefined {
  return modelDefs.find((m: ModelDef) => m.name === name);
}
export function getListQueryFn(modelName: string) {
  const def = findModelDef(modelName);
  return def?.listQueryFn || defaultListQueryFn(modelName);
}

export function getGetQueryFn(modelName: string, simple?: boolean) {
  const def = findModelDef(modelName);
  return simple ? defaultGetQueryFn(modelName) : def?.getQueryFn || defaultGetQueryFn(modelName);
}

export function getUpdateFn(modelName: string) {
  const def = findModelDef(modelName);
  return def?.updateFn || defaultUpdateFn(modelName);
}

export function getCreateFn(modelName: string) {
  const def = findModelDef(modelName);
  return def?.createFn || defaultCreateFn(modelName);
}

export function getDeleteFn(modelName: string) {
  const def = findModelDef(modelName);
  return def?.deleteFn || defaultDeleteFn(modelName);
}

export function getModelApi(modelName: string) {
  const schemaId = `/farmbook/${modelName}`;
  return getModel(schemaId);
}

export function getBulkCreateFn(modelName: string) {
  const def = findModelDef(modelName);
  return def?.bulkCreateFn || defaultBulkCreateFn(modelName);
}

export function getBulkUpdateFn(modelName: string) {
  const def = findModelDef(modelName);
  return def?.bulkUpdateFn || defaultBulkUpdateFn(modelName);
}
