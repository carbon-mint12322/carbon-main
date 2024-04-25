import { Coordinate } from '~/utils/coordinatesFormatter';
import { getSchema } from './getSchema';
import { convertRawObjectToSchemaBasedTitleObject } from './convertRawObjectToSchemaBasedTitleObject';
import { conversionFromEventDetailsToModalDetails } from './conversionFromEventDetailsToModalDetails';
import { getEvidences } from './getEvidences';

/** */
export function getDetailsConvertedToModalJson(
  details: Record<string, any>,
  schemaName: string,
  coordinates: Coordinate[][],
) {
  const schema = getSchema(schemaName);
  const jsonWithTitle = convertRawObjectToSchemaBasedTitleObject(details, schema);
  const modalJson = conversionFromEventDetailsToModalDetails(jsonWithTitle);
  const MapItem = {
    name: 'map',
    UIRenderType: 'map',
    nestedCoordinates: coordinates,
    markers: [],
  };

  const evidencesSection = getEvidences(modalJson, details);

  if (evidencesSection) {
    return [...modalJson, evidencesSection, MapItem];
  }

  return [...modalJson, MapItem];
}
