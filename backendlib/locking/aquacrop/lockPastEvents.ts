import dayjs from 'dayjs';
import { IWorkflowStepArg, Step, pipe } from '@carbon-mint/qrlib/build/main/lib/util/pipe';
import { IDbTransactionSession } from '@carbon-mint/qrlib/build/main/lib/types/db-types';
import { PrimitiveFunctions } from '@carbon-mint/qrlib/build/main/lib/types/primitives-types';
import mergeValue from '@carbon-mint/qrlib/build/main/lib/util/mergeValue';

const listEventIds: Step = async (x: IWorkflowStepArg) => {
  const { ctx: wfctx } = x;
  const eventList = await fetchEvents(
    x.primitives,
    wfctx.wf.domainSchemaId,
    eventListFilter(x),
    { sort: { createdAt: -1 } },
    x.ctx.dbSession,
  );
  const eventIdList: string[] = eventList.map((evt: any) => evt._id);
  return mergeValue({ eventList, eventIdList }, x);
};

const lockEventIds: Step = async (x: IWorkflowStepArg) => {
  const { value } = x;
  const eventIdList: string[] = value.eventIdList;
  const proms = eventIdList.map((id: string) => {
    const mods = {
      locked: true,
      lockDate: dayjs().toISOString(),
      lockedBy: x.ctx.session.userId,
    };
    return x.primitives
      .getModel('/farmbook/event')
      .update(id, mods, x.ctx.session.userId, x.ctx.dbSession);
  });
  await Promise.all(proms);
  return mergeValue({ eventIdList }, x);
};

const fetchEvents = async (
  primitives: PrimitiveFunctions,
  schemaId: any,
  filter: any,
  options: any,
  dbSession: IDbTransactionSession,
) => primitives.getModel(schemaId).list(filter, options, dbSession);

const eventListFilter = (x: IWorkflowStepArg) => ({
  aquaId: x.ctx.wf.domainContextObjectId,
});

const lockPastEvents: Step = pipe(listEventIds, lockEventIds);

export default lockPastEvents;
