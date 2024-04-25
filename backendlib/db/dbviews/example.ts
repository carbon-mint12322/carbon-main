import MongoAdapter from '../MongoAdapter';
import dotenv from 'dotenv';
import { farmerListViewQuery } from './farmer/farmerListViewQuery';
import { model2schemaId } from './util';

const FARMER_SCHEMA_ID = model2schemaId('farmer');
const LP_SCHEMA_ID = model2schemaId('landparcel');
const CROP_SCHEMA_ID = model2schemaId('crop');
const LP_FARMER_SCHEMA_ID = model2schemaId('landparcel_farmer');

const FarmerApi = MongoAdapter.getModel(FARMER_SCHEMA_ID);
const LpApi = MongoAdapter.getModel(LP_SCHEMA_ID);
const CropApi = MongoAdapter.getModel(CROP_SCHEMA_ID);
export const LpFarmerApi = MongoAdapter.getModel(LP_FARMER_SCHEMA_ID);

const insert = async () => {
  await LpFarmerApi.createMany(lpFarmerInput());
  await CropApi.createMany(cropInput());
  await FarmerApi.createMany(farmerInput());
  await LpApi.createMany(lpInput());
};

const query = async () => {
  const results = await farmerListViewQuery();
  return results;
};

const cleanup = async () => {
  await LpFarmerApi.removeAll();
  await FarmerApi.removeAll();
  await LpApi.removeAll();
  await CropApi.removeAll();
  await MongoAdapter.disconnect();
};

const main = async () => {
  dotenv.config();
  await MongoAdapter.connect();

  await insert();
  const items = await query();
  console.log(jsonify(items));
  await cleanup();
};

main();

// Local util functions

function lpInput(): any[] {
  return [
    { id: 'l1', name: 'l1 land parcel' },
    { id: 'l2', name: 'l2 land parcel' },
    { id: 'l6', name: 'l6 land parcel' },
    { id: 'l12', name: 'l12 land parcel' },
  ];
}

function farmerInput(): any[] {
  return [
    {
      id: 'f1',
      firstName: 'one',
      lastName: 'ONE',
    },
    {
      id: 'f2',
      firstName: 'two',
      lastName: 'TWO',
    },
    {
      id: 'f3',
      firstName: 'three',
      lastName: 'THREE',
    },
  ];
}

function cropInput(): any[] {
  return [
    {
      farmer: 'f1',
      landParcel: 'l1',
      season: 'Kharif 2022',
      name: 'Jowar',
    },
    {
      farmer: 'f1',
      landParcel: 'l1',
      season: 'Rabbi 2022',
      name: 'Jowar',
    },

    {
      farmer: 'f2',
      landParcel: 'l2',
      season: 'Kharif 2022',
      name: 'Jowar',
    },
    {
      farmer: 'f2',
      landParcel: 'l2',
      season: 'Rabbi 2022',
      name: 'Jowar',
    },
  ];
}

function lpFarmerInput(): any[] {
  return [
    { farmer: 'f1', landParcel: 'l1' },
    { farmer: 'f2', landParcel: 'l2' },
  ];
}

const jsonify = (x: any) => JSON.stringify(x, null, 2);
