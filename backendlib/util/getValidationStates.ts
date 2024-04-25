import { IWorkflowStepArg } from '@carbon-mint/qrlib/build/main/lib/util/pipe';
import { State } from '../workflow/types';
import dayjs from 'dayjs';
import { historyStateLabel } from '../helper/lockpipeline/historyStateLabel';
import { get } from 'lodash';

/** */
export async function getValidationStates(x: IWorkflowStepArg) {
  //
  const historyStates = makeStateArr(x.ctx.wf?.state).filter((item: any) => item.name !== 'start');

  //
  const validationHistory: any[] = [];
  // add the current state to history
  const tempSesion: any = x.ctx.session
  validationHistory.push({
    username: x.ctx.session.name || tempSesion.email,
    status: 'Validated',
    dateTime: dayjs().format('DD/MM/YYYY'),
    formObj: get(x.ctx, 'event.validationLifeCycleData', {}),
  });
  await Promise.all(
    historyStates.map((historyItem: State) => {
      validationHistory.push({
        username:
          historyItem?.data?.event?.userSession.name || historyItem?.data?.event?.userSession.email,
        status: historyStateLabel(historyItem),
        dateTime: dayjs(historyItem?.data?.event?.ts).format('DD/MM/YYYY'),
        formObj: get(historyItem, 'data.event.validationLifeCycleData', {}),
      });
    }),
  );

  return validationHistory;
}

function makeStateArr(node: State | undefined): State[] {
  if (!node) {
    return [];
  }
  if (!node.history) {
    return [node];
  }
  return [node, ...makeStateArr(node.history?.previousState)];
}
