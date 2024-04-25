import { getModel } from '~/backendlib/db/adapter';
const CertificationBodiesApi = getModel('/farmbook/certificationbodies');

/** */
export async function getSchemes(
  schemes: { CertificationBodyId?: string }[],
): Promise<{ certificationBodyId?: Object }[]> {
  const schemePromises = schemes?.map(async (scheme) => {
    const CertificationBodyRow = await CertificationBodiesApi.findOne(scheme.CertificationBodyId);

    return {
      ...scheme,
      certificationBodyId: CertificationBodyRow,
      CertificationBodyId: CertificationBodyRow,
    };
  });

  if (!schemePromises) return [];

  return Promise.all(schemePromises);
}
