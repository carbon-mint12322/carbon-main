import { getModel } from '~/backendlib/db/adapter';
const LandParcelFarmerApi = getModel('/farmbook/landparcel_farmer');

interface Props {
  farmerId: string;
  landParcelId: string;
}

export async function getOwnershipStatus({ farmerId, landParcelId }: Props) {
  //
  if (!farmerId) return 'NA';
  //
  if (!landParcelId) throw new Error('Landparcel ID not available');

  const row = await LandParcelFarmerApi.getByFilter({ farmer: farmerId, landParcel: landParcelId, active : true});

  return row?.ownership;
}
