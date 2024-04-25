/* eslint-disable no-console */
require('dotenv').config();

import { runJobs } from '@carbon-mint/jobs';
import { sleepTill } from '@carbon-mint/jobs/dist/helper/Utils';
import { after, before, describe } from 'mocha';
import { connectDB } from '~/backendlib/db/adapter';

import { getModel } from '~/backendlib/db/adapter';
import { assert } from 'chai';

import chai from 'chai';
import chaiHttp from 'chai-http';
import { initiateMongoConnection } from '~/backendlib/crop/plan/schedule';
import { getYearMonthDateConverted } from '~/backendlib/util/getYearMonthDateConverted';
import dayjs from 'dayjs';
import { PlanEventT } from '~/backendlib/types';
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import { getNumberOfDaysBeforePlanEventForNotification } from '~/backendlib/util/getNumberOfDaysBeforePlanEventForNotification';
import { findSowingEventInPlanEvents } from '~/backendlib/helpers';
import { isJobCompleted } from '~/backendlib/crop/plan/schedule/isJobCompleted';
import { ChaiRequest } from './helpers/ChaiRequest';
import { Job } from '@carbon-mint/jobs/dist/model/Job';
import { ObjectId } from 'mongodb';

const host = 'http://localhost:3000';
const CropModelApi = getModel('/farmbook/crop');
const PlanModelApi = getModel('/farmbook/plans');
const JobApi = getModel('/farmbook/jobs');

chai.use(chaiHttp);

const FARM = 'kadavur-organic-farmers';

// Get valid crop data and update here
const cropData = {
  category: 'Main',
  nutritionRequirements: {
    greenManure: false,
    greenLeafManure: false,
    fym: false,
    concentrates: false,
    bioFertilizer: false,
    otherComposts: false,
    biodynamicPreparations: false,
    chemicalFertilizers: false,
    microNutrients: false,
    minerals: false,
    bioStimulants: false,
    plantGrowthRegulators: false,
    growthRetardants: false,
    otherProducts: false,
  },
  name: 'Cotton',
  plantingMaterial: 'Seeds',
  season: 'Rabi',
  croppingSystem: '63f711c4daf0402df1b410bf',
  pop: '63ba2bec4c6e03160ff28667',
  cropType: 'Test',
  seedVariety: 'Test',
  seedSource: 'Test',
  areaInAcres: 2,
  estimatedYieldTonnes: 1,
  plannedSowingDate: dayjs(new Date()).format('YYYY-MM-DD'),
  estHarvestDate: dayjs(new Date()).add(50, 'days').format('YYYY-MM-DD'),
  landParcel: {
    id: '63d10bfb6dd8c0e6583166eb',
    name: 'A.Mariyappan',
  },
  farmer: {
    id: '63d10a796dd8c0e6583166d5',
    name: 'Mariyappan A',
  },
  status: 'Draft',
};

const PlanEvent = {
  // 642fd9718020dd00eee97c33
  name: 'new updating check',
  activityType: 'Land preparation',
  range: {
    start: dayjs(new Date()).add(2, 'days').format('YYYY-MM-DD'),
    end: dayjs(new Date()).add(3, 'days').format('YYYY-MM-DD'),
  },
  notificationJobIds: [],
};

describe('Crop Activation Toggle', () => {
  //   let planId = '63baa65005aa2c0773940b73';
  let cropId: string;
  let planId: string;
  let separatelyCreatedEventPlan: typeof PlanEvent & {
    _id: string;
    notificationJobId: string;
  };

  before(async () => {
    await connectDB();
    await initiateMongoConnection();
    return;
  });

  // Add a new crop via API & check if the events in crop all have different job IDs
  it('Crop add - Schedule all event notifications', async () => {
    //
    const response = await ChaiRequest({
      host,
      uri: `/api/farmbook/${FARM}/crop/create`,
      method: 'post',
      payload: cropData,
    });

    const {
      insertedId: insertedCropId,
      planAcknowledgement: { insertedId: insertedPlanId },
    } = response?.body ?? {};

    cropId = insertedCropId;
    planId = insertedPlanId;

    // Check if all jobs for planId are created
    const jobs = await JobApi.list({
      $or: [{ 'params.data.planId': new ObjectId(planId) }, { 'params.data.planId': planId }],
    });

    assert.isString(insertedCropId);
    assert.isString(insertedPlanId);
    assert.isArray(jobs);
    assert.isAtLeast(jobs.length, 1);
  });

  it('Deactivate crop and check if all jobs are deleted for it', async () => {
    // request to deactivate
    const response = await ChaiRequest({
      host,
      uri: `/api/farmbook/${FARM}/crop/${cropId}/toggle-notification`,
      method: 'post',
      payload: {
        activationStatus: false,
      },
    });

    // check if it's success
    const { success } = response?.body ?? {};

    // Check if all jobs for planId are deleted
    const jobs = await JobApi.list({
      $or: [{ 'params.data.planId': new ObjectId(planId) }, { 'params.data.planId': planId }],
    });

    assert.isTrue(success);
    assert.isEmpty(jobs);
  });

  it('Activate crop and check if new jobs are created', async () => {
    // request to activate
    const response = await ChaiRequest({
      host,
      uri: `/api/farmbook/${FARM}/crop/${cropId}/toggle-notification`,
      method: 'post',
      payload: {
        activationStatus: true,
      },
    });

    // check if it's success
    const { success } = response?.body ?? {};

    // Check if all jobs for planId are created
    const jobs = await JobApi.list({
      $or: [{ 'params.data.planId': new ObjectId(planId) }, { 'params.data.planId': planId }],
    });

    assert.isTrue(success);
    assert.isArray(jobs);
    assert.isAtLeast(jobs.length, 1);
  });

  after('Delete plan & Crop', async () => {
    // Delete the created crop & plan
    if (!cropId || !planId) throw new Error('Ids not valid.');

    await PlanModelApi.remove(planId);

    await CropModelApi.remove(cropId);

    console.log('Deleted testing data.');

    return true;
  });
});
