require('dotenv').config();

import { before, describe } from 'mocha';
import { ChaiRequest, URI } from './helpers/ChaiRequest';
import { assert } from 'chai';
import { ObjectId } from 'mongodb';
import { getModel } from '~/backendlib/db/adapter';
import { LandParcel } from '~/backendlib/landparcel/types';

const schemaId = '/farmbook/landparcel';
const LandParcelModelApi = getModel(schemaId);

const host = 'http://localhost:3000';

describe('LandParcel Water Sources CRUD', () => {
  const OriginalWaterSources = getOriginalWaterSources();
  const UpdatedWaterSources = getUpdatedWaterSources();

  let newWaterSourcesId = '';
  let landparcel: LandParcel;
  let operator: string;
  let existingLandParcelWaterSourcesLength: number;

  before(async () => {
    // getting the first landparcel
    landparcel = await getFirstLandParcel();
    // get length of water sources
    existingLandParcelWaterSourcesLength = (landparcel?.waterSources ?? []).length;
    // get operator for landparcel
    operator = await getOperator();
  });

  it('Create a new water sources', async () => {
    const response = await ChaiRequest({
      host,
      uri: getBaseURI(operator, landparcel?._id.toString()),
      method: 'post',
      payload: OriginalWaterSources,
    });

    if (response?.body?.modifiedCount !== 1) throw new Error('Water Source not created');

    newWaterSourcesId = (response.body?.upsertedId ?? '').toString();

    if (!newWaterSourcesId.length) throw new Error('Water Source not valid.');

    // Get updated water sources directly from db
    const landparcelModel = await LandParcelModelApi.get(landparcel?._id.toString());

    const addedWaterSources = (landparcelModel?.waterSources ?? []).find(
      (cp: LandParcel) => cp?._id?.toString() === newWaterSourcesId,
    );

    assert.deepEqual(addedWaterSources, {
      _id: new ObjectId(newWaterSourcesId),
      ...OriginalWaterSources,
    });
  });

  it('Get the newly created water sources', async () => {
    const response = await ChaiRequest({
      host,
      uri: `${getBaseURI(operator, landparcel?._id.toString())}/${newWaterSourcesId}`,
      method: 'get',
    });

    assert.deepEqual(response.body, {
      _id: newWaterSourcesId,
      ...OriginalWaterSources,
    });
  });

  it('Update the newly created water sources', async () => {
    // Updating events
    const response = await ChaiRequest({
      host,
      uri: `${getBaseURI(operator, landparcel?._id.toString())}/${newWaterSourcesId}`,
      method: 'put',
      payload: UpdatedWaterSources,
    });

    if (response?.body?.modifiedCount !== 1) throw new Error('Water Source not updated.');

    // Get updated water sources directly from db
    const landparcelModel = await LandParcelModelApi.get(landparcel?._id.toString());

    const updatedWaterSources = (landparcelModel?.waterSources ?? []).find(
      (cp: LandParcel) => cp?._id?.toString() === newWaterSourcesId,
    );

    assert.deepEqual(updatedWaterSources, {
      _id: new ObjectId(newWaterSourcesId),
      ...UpdatedWaterSources,
    });
  });

  it('Delete the newly created water sources', async () => {
    const response = await ChaiRequest({
      host,
      uri: `${getBaseURI(operator, landparcel?._id.toString())}/${newWaterSourcesId}`,
      method: 'delete',
    });

    if (response.body?.modifiedCount !== 1) throw new Error('LandParcel not modified.');

    // Get updated water sources directly from db
    const landparcelModel = await LandParcelModelApi.get(landparcel?._id.toString());

    const waterSources = landparcelModel?.waterSources ?? [];

    const deletedWaterSources = waterSources.find(
      (cp: LandParcel) => cp?._id?.toString() === newWaterSourcesId,
    );

    assert.strictEqual(waterSources.length, existingLandParcelWaterSourcesLength);
    assert.equal(deletedWaterSources, undefined);
  });
});

/** */
function getBaseURI(operator: string, id: string): URI {
  return `/api/farmbook/${operator}/nested/${id}/water-sources`;
}

/** */
async function getFirstLandParcel(): Promise<LandParcel> {
  const LandParcels = await LandParcelModelApi.list({});
  return LandParcels[0];
}

/** */
async function getOperator(): Promise<string> {
  return 'kadavur-organic-farmers';
}

/** */
function getOriginalWaterSources() {
  return {
    source: 'Borewell',
    details: { name: '1', depth: 1, diameter: 2, pumpUsed: { pumpType: 'Submersible' } },
  };
}

/** */
function getUpdatedWaterSources() {
  return {
    source: 'Borewell',
    details: { name: '2', depth: 2, diameter: 4, pumpUsed: { pumpType: 'Submersible' } },
  };
}
