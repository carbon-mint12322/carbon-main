require('dotenv').config();

import { before, describe } from 'mocha';
import { ChaiRequest, URI } from './helpers/ChaiRequest';
import { assert } from 'chai';
import { ObjectId } from 'mongodb';
import { getModel } from '~/backendlib/db/adapter';
import { Pop } from '~/backendlib/pop/types';

const schemaId = '/farmbook/pop';
const PopModelApi = getModel(schemaId);

const host = 'http://localhost:3000';

describe('Pop Control Points CRUD', () => {
  const OriginalConrtolPoint = getOriginalControlPoint();
  const UpdatedControlPoint = getUpdatedControlPoint();

  let newControlPointId = '';
  let pop: Pop;
  let operator: string;
  let existingPopControlPointLength: number;

  before(async () => {
    // getting the first pop
    pop = await getFirstPop();
    // get length of control points
    existingPopControlPointLength = (pop?.controlPoints ?? []).length;
    // get operator for pop
    operator = await getOperator();
  });

  it('Create a new control point', async () => {
    const response = await ChaiRequest({
      host,
      uri: getBaseURI(operator, pop?._id.toString()),
      method: 'post',
      payload: OriginalConrtolPoint,
    });

    if (response?.body?.modifiedCount !== 1) throw new Error('Control point not created');

    newControlPointId = (response.body?.upsertedId ?? '').toString();

    if (!newControlPointId.length) throw new Error('Control point not valid.');

    // Get updated control point directly from db
    const popModel = await PopModelApi.get(pop?._id.toString());

    const addedControlPoint = (popModel?.controlPoints ?? []).find(
      (cp: Pop) => cp?._id?.toString() === newControlPointId,
    );

    assert.deepEqual(addedControlPoint, {
      _id: new ObjectId(newControlPointId),
      ...OriginalConrtolPoint,
    });
  });

  it('Get the newly created control point', async () => {
    const response = await ChaiRequest({
      host,
      uri: `${getBaseURI(operator, pop?._id.toString())}/${newControlPointId}`,
      method: 'get',
    });

    assert.deepEqual(response.body, {
      _id: newControlPointId,
      ...OriginalConrtolPoint,
    });
  });

  it('Update the newly created control point', async () => {
    // Updating events
    const response = await ChaiRequest({
      host,
      uri: `${getBaseURI(operator, pop?._id.toString())}/${newControlPointId}`,
      method: 'put',
      payload: UpdatedControlPoint,
    });

    if (response?.body?.modifiedCount !== 1) throw new Error('Control point not updated.');

    // Get updated control point directly from db
    const popModel = await PopModelApi.get(pop?._id.toString());

    const updatedControlPoint = (popModel?.controlPoints ?? []).find(
      (cp: Pop) => cp?._id?.toString() === newControlPointId,
    );

    assert.deepEqual(updatedControlPoint, {
      _id: new ObjectId(newControlPointId),
      ...UpdatedControlPoint,
    });
  });

  it('Delete the newly created control point', async () => {
    const response = await ChaiRequest({
      host,
      uri: `${getBaseURI(operator, pop?._id.toString())}/${newControlPointId}`,
      method: 'delete',
    });

    if (response.body?.modifiedCount !== 1) throw new Error('Pop not modified.');

    // Get updated control point directly from db
    const popModel = await PopModelApi.get(pop?._id.toString());

    const controlPoints = popModel?.controlPoints ?? [];

    const deletedControlPoint = controlPoints.find(
      (cp: Pop) => cp?._id?.toString() === newControlPointId,
    );

    assert.strictEqual(controlPoints.length, existingPopControlPointLength);
    assert.equal(deletedControlPoint, undefined);
  });
});

/** */
function getBaseURI(operator: string, id: string): URI {
  return `/api/farmbook/${operator}/pop/${id}/controlpoint`;
}

/** */
async function getFirstPop(): Promise<Pop> {
  const PopModelApi = getModel('/farmbook/pop');
  const Pops = await PopModelApi.list({});
  return Pops[0];
}

/** */
async function getOperator(): Promise<string> {
  return 'kadavur-organic-farmers';
}

/** */
function getOriginalControlPoint() {
  return {
    activityType: 'Land preparation',
    days: {
      start: 1,
      end: 2,
    },
    repeated: false,
    name: 'Old',
    period: '1',
  };
}

/** */
function getUpdatedControlPoint() {
  return {
    activityType: 'Land preparation',
    days: {
      start: 3,
      end: 5,
    },
    repeated: false,
    name: 'New',
    period: '2',
  };
}
