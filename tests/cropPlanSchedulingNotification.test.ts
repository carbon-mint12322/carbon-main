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

const host = 'http://localhost:3000';
const CropModelApi = getModel('/farmbook/crop');
const PlanModelApi = getModel('/farmbook/plans');

chai.use(chaiHttp);

const ADD_DAYS = 3;

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
  pop: '63ba26830ac3f9be06a64a54',
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

const getWorflowEvent = ({
  cropId,
  startDate,
  endDate,
}: {
  cropId: string;
  startDate: string;
  endDate: string;
}) => ({
  wfName: 'sowingWorkflow',
  domainObjectId: cropId,
  eventName: 'sowingEvent',
  eventData: {
    sowingPlantingMaterial: 'Seeds',
    classOfPlantingMaterial: ['classBreeder'],
    seedRateUnits: 'Kgs',
    seedSeedlingTreatment: 'Biofertilizer',
    natureOfSowing: 'Direct sown',
    useCleanedPlantingMaterial: 'Yes',
    seedPlantingMaterialSource: 'Own',
    durationAndExpenses: {
      startDate: startDate,
      endDate: endDate,
      totalExpenditure: 1,
    },
    evidences: [],
    name: 'Sowing Event',
  },
  org: 'kadavur-organic-farmers',
  domainSchemaName: 'crop',
  domainInstanceId: cropId,
});

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

describe('Crop Plan notification schedule', () => {
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
  it('Crop add - Schedule all event notifications', (done) => {
    chai
      .request(host)
      .post(`/api/farmbook/kadavur-organic-farmers/crop/create`)
      .set('cookie', process.env.TEST_COOKIE_TOKEN || '')
      .send(cropData)
      .end(async (err: any, res: any) => {
        try {
          console.log({ err: JSON.stringify(err) });
          console.log({ res: JSON.stringify(res.body) });

          const {
            insertedId: cropInsertedId,
            planAcknowledgement: { insertedId },
          } = res.body;

          if (!cropInsertedId) {
            throw new Error('Created Crop ID not valid.');
          }

          cropId = cropInsertedId;

          if (!insertedId) {
            throw new Error('Created Plan ID not valid.');
          }

          const createdPlanId = insertedId;

          const plan = await PlanModelApi.get(createdPlanId);

          if (!(plan?._id && plan?.events?.length)) throw new Error('Plan events not valid.');

          plan?.events.forEach((item: any) => {
            const isAfterToday = dayjs(convertDMYToYMD(item.range.start)).isAfter(
              new Date().toISOString(),
            );

            // if not past event, notifications should be created
            if (isAfterToday && !item.notificationJobIds.length)
              throw new Error('Notifications not created for plan event');

            // notification should not be created for past events
            if (!isAfterToday && item.notificationJobIds.length)
              throw new Error('Notifications are created for past events');

            return true;
          });

          planId = createdPlanId;

          assert.equal(true, true);
        } catch (e) {
          console.error((e as Error).message);
          assert.equal(0, 1);
        }

        done();
      });
  });

  // Call add a new event api & check if newly created event has jobId
  it('Individual Event Add - Scheduling notificaiton check', (done) => {
    if (!planId) {
      assert.equal(0, 1);
      done();
    }

    chai
      .request(host)
      .post(`/api/farmbook/kadavur-organic-farmers/plan/${planId}/add`)
      .set('Cookie', process.env.TEST_COOKIE_TOKEN || '')
      .send(PlanEvent)
      .end(async (err: any, res: any) => {
        try {
          const { eventPlanIds } = res.body;

          if (!(eventPlanIds?.length === 1)) throw new Error('EventPlanId not valid.');

          const plan = await PlanModelApi.get(planId);

          if (!plan?.events?.length) throw new Error('Plan events not valid.');

          const eventPlan = ((events) => {
            return events.find((e: any) => e?._id === eventPlanIds[0]);
          })(plan.events);

          if (!eventPlan) throw new Error('Event plan not found in plan array');

          if (!eventPlan?.notificationJobIds.length) throw new Error('Notification Id not valid');

          assert.equal(true, true);
          separatelyCreatedEventPlan = eventPlan;
        } catch (e) {
          console.error((e as Error).message);
          assert.equal(0, 1);
        }

        done();
      });
  });

  // Add test case to check if multiple plan events are created for repeated param
  it('Repeated Event Add - Creation & Scheduling notificaiton check', (done) => {
    if (!planId) {
      assert.equal(0, 1);
      done();
    }

    chai
      .request(host)
      .post(`/api/farmbook/kadavur-organic-farmers/plan/${planId}/add`)
      .set('Cookie', process.env.TEST_COOKIE_TOKEN || '')
      .send({ ...PlanEvent, repeated: true, frequency: 2, ends: 12 })
      .end(async (err: any, res: any) => {
        try {
          const { eventPlanIds } = res.body;

          if (!(eventPlanIds?.length === 6)) throw new Error('EventPlanId not valid.');

          const plan = await PlanModelApi.get(planId);

          if (!plan?.events?.length) throw new Error('Plan events not valid.');

          const eventPlans = plan.events.filter((e: PlanEventT) => eventPlanIds.includes(e?._id));

          if (!eventPlans?.length) throw new Error('Event plan not found in plan array');

          eventPlans.forEach((eventPlan: PlanEventT) => {
            if (!eventPlan?.notificationJobIds?.length)
              throw new Error('Notification Id not valid');
          });

          assert.equal(true, true);
        } catch (e) {
          console.error((e as Error).message);
          assert.equal(0, 1);
        }

        done();
      });
  });

  // Call update the event API & check if it has a new jobId
  it('Individual event update - If Job Id changes check', (done) => {
    if (!planId) {
      assert.equal(0, 1);
      done();
    }

    if (!separatelyCreatedEventPlan?._id) {
      assert.equal(0, 1);
      done();
    }

    const eventPlanId = separatelyCreatedEventPlan._id;

    chai
      .request(host)
      .put(
        `/api/farmbook/kadavur-organic-farmers/plan/${planId}/update/${separatelyCreatedEventPlan._id.toString()}`,
      )
      .set('Cookie', process.env.TEST_COOKIE_TOKEN || '')
      .send({
        ...PlanEvent,
        range: {
          start: dayjs(PlanEvent.range.start).add(1, 'days').format('YYYY-MM-DD'),
          end: dayjs(PlanEvent.range.end).add(1, 'days').format('YYYY-MM-DD'),
        },
      })
      .end(async (err: any, res: any) => {
        try {
          const fetchedPlan = await PlanModelApi.get(planId);

          if (!fetchedPlan?.events?.length) throw new Error('Plan events not valid.');

          const updatedEventPlan = ((events) => {
            return events.find((e: any) => e?._id === eventPlanId);
          })(fetchedPlan.events);

          if (!updatedEventPlan) throw new Error('Event plan not found in plan array');

          const eventPlanNotificationIds = updatedEventPlan?.notificationJobIds ?? [];

          if (!eventPlanNotificationIds.length)
            throw new Error('eventPlan : Notification ids not valid');

          const separatelyCreatedEventPlanNotificationIds: string[] =
            separatelyCreatedEventPlan?.notificationJobIds?.map((id: any) => id?.toString()) || [];

          if (!separatelyCreatedEventPlanNotificationIds.length)
            throw new Error('separatelyCreatedEventPlan : Notification ids not valid');

          assert.equal(
            eventPlanNotificationIds.every(
              (notificationId: string) =>
                !separatelyCreatedEventPlanNotificationIds.includes(notificationId.toString()),
            ),
            true,
          );
        } catch (e) {
          console.error(e as Error);
          assert.equal(0, 1);
        }

        done();
      });
  });

  // Check if on updating on repeat works as intended
  it('Repeat event update - If multiple events are created check', (done) => {
    if (!planId) {
      assert.equal(0, 1);
      done();
    }

    if (!separatelyCreatedEventPlan?._id) {
      assert.equal(0, 1);
      done();
    }

    const newName = 'new event updating 2';

    chai
      .request(host)
      .put(
        `/api/farmbook/kadavur-organic-farmers/plan/${planId}/update/${separatelyCreatedEventPlan._id.toString()}`,
      )
      .set('Cookie', process.env.TEST_COOKIE_TOKEN || '')
      .send({
        ...PlanEvent,
        name: newName,
        range: {
          start: dayjs(PlanEvent.range.start).add(1, 'days').format('YYYY-MM-DD'),
          end: dayjs(PlanEvent.range.end).add(1, 'days').format('YYYY-MM-DD'),
        },
        repeated: true,
        frequency: 2,
        ends: 12,
      })
      .end(async (err: any, res: any) => {
        try {
          const fetchedPlan = await PlanModelApi.get(planId);

          if (!fetchedPlan?.events?.length) throw new Error('Plan events not valid.');

          const totalEventsInPlan = fetchedPlan.events
            .map((event: PlanEventT) => (event.name === newName ? 1 : 0))
            .reduce((acc: number, curr: number) => acc + curr, 0);

          assert.equal(totalEventsInPlan, 6);
        } catch (e) {
          console.error(e as Error);
          assert.equal(0, 1);
        }

        done();
      });
  });

  const sowingEventUpdateCheck = async ({
    updateEvent,
    existingPlanEvents,
  }: {
    updateEvent: (p: PlanEventT) => Promise<boolean>;
    existingPlanEvents: PlanEventT[];
  }): Promise<boolean> => {
    const existingSowingEvent = findSowingEventInPlanEvents(existingPlanEvents);

    if (!(await updateEvent(existingSowingEvent))) throw new Error('Updating events failed');

    // get updated plan
    const updaedPlan = await PlanModelApi.get(planId);

    // get plan events
    let updatedPlanEvents = updaedPlan?.events || [];
    if (!updatedPlanEvents.length) throw new Error('plan events not valid on updated plan');

    //
    const checkIfTheDifferenceIsCorrectInPlanEvents = ({
      planEventOld,
      planEventUpdated,
    }: {
      planEventOld: PlanEventT;
      planEventUpdated: PlanEventT;
    }) => {
      const checkDifferenceInPlanEvents = (days: number) => {
        const startDateDifference = dayjs(rearrangeDateDMYToYMD(planEventUpdated.range.start)).diff(
          rearrangeDateDMYToYMD(planEventOld.range.start),
          'days',
        );

        if (startDateDifference !== days)
          throw new Error(
            'start date not as expected. Data: ' +
              JSON.stringify({
                plan: planEventOld,
                expected: days,
                actual: startDateDifference,
              }),
          );

        const endDateDifference = dayjs(rearrangeDateDMYToYMD(planEventUpdated.range.end)).diff(
          rearrangeDateDMYToYMD(planEventOld.range.end),
          'days',
        );

        // return false if date difference is not equal to expected difference
        if (endDateDifference !== days)
          throw new Error(
            'end date not as expected. Data: ' +
              JSON.stringify({
                plan: planEventOld,
                expected: days,
                actual: endDateDifference,
              }),
          );

        return true;
      };

      // check if there is no difference between old and new plan event's range
      const checkIfThereIsNoDifference = () => checkDifferenceInPlanEvents(0);

      // check if there is difference between old and new plan event's range
      const checkIfThereIsDifference = () => checkDifferenceInPlanEvents(ADD_DAYS);

      // is the original plan start is after than original sowing date (sowing event)
      const isAfterThanSowingDate = !dayjs(
        rearrangeDateDMYToYMD(planEventOld.range.start),
      ).isBefore(dayjs(rearrangeDateDMYToYMD(existingSowingEvent.range.start)));

      return isAfterThanSowingDate ? checkIfThereIsDifference() : checkIfThereIsNoDifference();
    };

    const checkIfNotificationUpdateIsCorrectInPlanEvents = async ({
      planEventOld,
      planEventUpdated,
    }: {
      planEventOld: PlanEventT;
      planEventUpdated: PlanEventT;
    }) => {
      const newNotificationIds = planEventUpdated?.notificationJobIds ?? [];

      const oldNotificationIds: string[] =
        planEventOld?.notificationJobIds?.map((id: any) => id?.toString()) || [];

      newNotificationIds.forEach((notificationId: string) => {
        if (oldNotificationIds.includes(notificationId.toString()))
          throw new Error('Old notification id is not modified.');
      });

      return true;
    };

    // loop plan events and pass the data to isDifferenceUpdated
    // if any one is false, throw error that difference not updated
    for (const oldPlan of existingPlanEvents) {
      const newPlan = updatedPlanEvents.find((p: PlanEventT) => p._id === oldPlan._id);

      if (!newPlan) throw new Error('Updated Plan not found for ID: ' + oldPlan._id);

      checkIfTheDifferenceIsCorrectInPlanEvents({
        planEventOld: oldPlan,
        planEventUpdated: newPlan,
      });

      await checkIfNotificationUpdateIsCorrectInPlanEvents({
        planEventOld: oldPlan,
        planEventUpdated: newPlan,
      });
    }

    return true;
  };

  const SowingEventApiUpdate = async () => {
    if (!planId) {
      throw new Error('Plan ID not valid');
    }

    const existingPlan = await PlanModelApi.get(planId);

    if (!existingPlan?.events?.length) {
      throw new Error('existingPlan not valid');
    }

    const existingPlanEvents = existingPlan?.events ?? [];

    if (!existingPlanEvents?.length) {
      throw new Error('existingPlanEvents not valid');
    }

    const updateEvent = async (sowingEvent: PlanEventT): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const updatedSowingEvent = {
          ...sowingEvent,
          range: {
            start: dayjs(rearrangeDateDMYToYMD(sowingEvent.range.start))
              .add(ADD_DAYS, 'days')
              .format('YYYY-MM-DD'),

            end: dayjs(rearrangeDateDMYToYMD(sowingEvent.range.end))
              .add(ADD_DAYS, 'days')
              .format('YYYY-MM-DD'),
          },
        };

        chai
          .request(host)
          .put(`/api/farmbook/kadavur-organic-farmers/plan/${planId}/update/${sowingEvent._id}`)
          .set('Cookie', process.env.TEST_COOKIE_TOKEN || '')
          .send(updatedSowingEvent)
          .end(async (err: any, res: any) => {
            if (err) return reject(err);

            if (res.status !== 200) return reject(res.body);

            resolve(res);
          });
      });
    };

    try {
      const res = await sowingEventUpdateCheck({
        updateEvent,
        existingPlanEvents,
      });
      assert.equal(res, true);
    } catch (e) {
      console.log(e);
      throw e as Error;
    }
  };

  //  Sowing event update, which should change all range (start & end) for all
  // & should generate new notification id for every plan event except which are older than current iso timestamp
  //
  it('API - Sowing event update - All plan events & notification Job ids change (except past ones)', async () => {
    await SowingEventApiUpdate();
  });

  it('WORKFLOW - Sowing event update - All plan events & notification Job ids change (except past ones)', async () => {
    if (!planId) {
      throw new Error('Plan ID not valid');
    }

    const existingPlan = await PlanModelApi.get(planId);

    if (!existingPlan?.events?.length) {
      throw new Error('existingPlan not valid');
    }

    const existingPlanEvents = existingPlan?.events ?? [];

    if (!existingPlanEvents?.length) {
      throw new Error('existingPlanEvents not valid');
    }

    const updateEvent = async (sowingEvent: PlanEventT): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const updatedSowingEvent = getWorflowEvent({
          cropId,
          startDate: dayjs(rearrangeDateDMYToYMD(sowingEvent.range.start))
            .add(ADD_DAYS, 'days')
            .format('YYYY-MM-DD'),
          endDate: dayjs(rearrangeDateDMYToYMD(sowingEvent.range.end))
            .add(ADD_DAYS, 'days')
            .format('YYYY-MM-DD'),
        });

        chai
          .request(host)
          .post(`/api/farmbook/kadavur-organic-farmers/create-event/crop/${cropId}/create`)
          .set('Cookie', process.env.TEST_COOKIE_TOKEN || '')
          .send(updatedSowingEvent)
          .end(async (err: any, res: any) => {
            if (err) return reject(err);

            if (res.status !== 200) return reject(res.body);

            resolve(res);
          });
      });
    };

    try {
      const res = await sowingEventUpdateCheck({
        updateEvent,
        existingPlanEvents,
      });
      assert.equal(res, true);
    } catch (e) {
      console.log(e);
      throw e as Error;
    }
  });

  it('Running scheduler', async () => {
    if (!planId) {
      assert.equal(0, 1);
    }

    let secondsElapsed = 0;

    try {
      while (secondsElapsed < 20) {
        await runJobs(10);

        await sleepTill(1);
        secondsElapsed++;
      }

      assert.equal(1, 1);
    } catch (e) {
      console.log(e as Error);
      assert.equal(0, 1);
    }
  });

  it('Second time API - Sowing event update', async () => {
    await SowingEventApiUpdate();
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

/** */
function convertDMYToYMD(date: string) {
  return date.split('/').reverse().join('-');
}
