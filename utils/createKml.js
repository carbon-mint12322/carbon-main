export const kml = (routeCoordinates, name) => {
  let geoJson = {};

  if (routeCoordinates.length === 1) {
    // Single point
    geoJson = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: routeCoordinates.map((coord) => [
          coord.longitude,
          coord.latitude,
          coord.altitude || 0,
        ]),
      },
      properties: {
        name,
      },
    };
  } else {
    // Polygon
    geoJson = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          routeCoordinates.map((coord) => [coord.longitude, coord.latitude, coord.altitude || 0]),
        ],
      },
      properties: {
        name,
        stroke: '#000000', // Border color (black)
        fill: '#00FF00', // Fill color (green)
        'fill-opacity': 0.6,
      },
    };
  }

  return jsontokml(geoJson);
};

export const jsontokml = (geojsonData) => {
  // Create KML file and write header
  let kmlString = '<?xml version="1.0" encoding="UTF-8"?>\n';
  kmlString += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';

  if (geojsonData.geometry) {
    kmlString += '<Placemark>\n';
    kmlString += `<name>${geojsonData.properties.name || ''}</name>\n`;
    kmlString += `<description>${geojsonData.properties.description || ''}</description>\n`;

    // Add custom styling properties
    kmlString += '<Style>\n';
    kmlString += '<LineStyle><color>FF24B824</color><width>15</width></LineStyle>\n'; // Border color (black) and width (20 pixels)
    kmlString += '<PolyStyle>\n';
    kmlString += `<color>4024B824</color>\n`; // Fill color (light green with 25% opacity)
    kmlString += '</PolyStyle>\n';
    kmlString += '</Style>\n';

    // Convert GeoJSON geometry to KML format
    const geometry = geojsonData.geometry;
    let kmlGeometry = '';
    if (geometry.type === 'Point') {
      kmlGeometry = `<Point><coordinates>${geometry.coordinates.join(
        ', ',
      )}</coordinates></Point>\n`;
    } else if (geometry.type === 'LineString') {
      kmlGeometry = `<LineString><coordinates>${geometry.coordinates.join(
        ' ',
      )}</coordinates></LineString>\n`;
    } else if (geometry.type === 'Polygon') {
      kmlGeometry = `<Polygon><outerBoundaryIs><LinearRing><coordinates>${geometry.coordinates[0].join(
        ' ',
      )}</coordinates></LinearRing></outerBoundaryIs></Polygon>\n`;
    }
    kmlString += kmlGeometry;

    kmlString += '</Placemark>\n';
  }

  // Write KML footer and return string
  kmlString += '</kml>\n';
  return kmlString;
};

export const downloadKML = (inputString, filename) => {
  const coordinatesString = inputString;
  // Convert the coordinates string to an array of objects
  const coordinatesArray = coordinatesString.split(' ').map((coordinate) => {
    const [longitude, latitude] = coordinate.split(',');
    return { longitude: parseFloat(longitude), latitude: parseFloat(latitude) };
  });
  // Generate the KML string using the coordinates array and lpData name
  const kmlString = kml(coordinatesArray, filename);
  // Create a Blob from the KML string
  const blob = new Blob([kmlString], { type: 'application/vnd.google-earth.kml+xml' });
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  // Create a link element to initiate the download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.kml`;
  // Append the link to the document body, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoke the URL to free up memory
  URL.revokeObjectURL(url);
};
