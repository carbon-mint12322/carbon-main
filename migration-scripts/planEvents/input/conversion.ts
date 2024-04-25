import { ACTIVITY_TYPE } from '~/backendlib/constants';

const conversion = {
  Sowing: ACTIVITY_TYPE.PLANTATION,
  'Seed procurement': ACTIVITY_TYPE.PLANTING_PROCUREMENT,
  'Seed treatment': ACTIVITY_TYPE.PLANTING_TREATMENT,
};

export default conversion;
