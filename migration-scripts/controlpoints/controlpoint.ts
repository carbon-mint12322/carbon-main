import { ObjectId } from 'mongodb';
import { ControlPoint } from '~/backendlib/pop/types';
import fs from 'fs';

import popJson from './input.json';

const { controlPoints } = popJson;

const controlPointsModified = controlPoints.map((cp: Omit<ControlPoint, 'repeated'>) => {
  return {
    // will have a default, but will be overwritten if it has already
    repeated: false,
    ...cp,
    _id: { $oid: new ObjectId() },
  };
});

fs.writeFileSync(__dirname + '/ouput.json', JSON.stringify(controlPointsModified));
