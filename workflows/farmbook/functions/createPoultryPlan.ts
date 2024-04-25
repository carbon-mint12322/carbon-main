import { createPlan } from '~/backendlib/functions/createPlan';

export default async function createPoultryPlan (
  ctx: any
) {
  const { wf, event, session } = ctx;
  const { domainObjectId: entityId } = wf;
  const data = event.data;
  const popId = data.poultryPop;

  await createPlan(
    popId,
    'poultrypop',
    entityId.toString(),
    'poultrybatch',
    data.chickPlacementDay,
    session.userId,
    session.org,
    `/farmbook/poultrybatch`,
  );

  return {};
};
