import { getBucketFileUrl, parseARN, writeFileWithOptions } from '~/backendlib/s3';
import { IWorkflowStepArg } from '@carbon-mint/qrlib/build/main/lib/util/pipe';

async function writeS3File(
  _x: IWorkflowStepArg,
  filename: string,
  meta: Record<string, string>,
  content: Buffer | string,
) {
  const filename2 = filename.replace('//', '/');
  const arn = await writeFileWithOptions(filename2, content, meta, { isPublic: true });
  const { bucketId, fileName } = parseARN(arn);
  const qrUrl = getBucketFileUrl(bucketId, fileName);
  return qrUrl;
}

export default writeS3File;
