import { Coordinate } from '~/utils/coordinatesFormatter';

export function getMapCoordinatesFromString(val: unknown): Coordinate[] {
  //
  if (typeof val !== 'string') return [];

  //
  return val.split(' ')?.map((item: any) => ({
    lat: parseFloat(item.split(',')[1]),
    lng: parseFloat(item.split(',')[0]),
  }));
}
