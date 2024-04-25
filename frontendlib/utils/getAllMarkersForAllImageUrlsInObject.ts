import { getAllImageUrlsInObject } from '~/backendlib/util/getAllImageUrlsInObject';
import { getLatLongFromRemoteURL } from '~/backendlib/util/getLatLongFromRemoteURL';
import { Coordinate } from '~/utils/coordinatesFormatter';

/** */
export async function getAllMarkersForAllImageUrlsInObject(obj: Object): Promise<Coordinate[]> {
  const allImageUrls = getAllImageUrlsInObject(obj);
  const markers: Coordinate[] = [];

  //
  for (const imageUrl of allImageUrls) {
    const position = await getLatLongFromRemoteURL(imageUrl);
    if (position) {
      markers.push(position);
    }
  }

  return markers;
}
