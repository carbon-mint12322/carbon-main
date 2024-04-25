import { IWorkflowStepArg } from '@carbon-mint/qrlib/build/main/lib/util/pipe';
import { ObjectId } from 'mongodb';

/** */
export async function qrSaveLinkOnContext(x: IWorkflowStepArg): Promise<IWorkflowStepArg> {
  const mods = {
    qrLink: x.value.qrUrl,
    test: 1,
  };

  const result = await x.primitives
    .getModel(x.value.domainContextSchemaId)
    .update(x.value.domainContextObjectId.toString(), mods, x.ctx.session.userId, x.ctx.dbSession);

  return x;
}
