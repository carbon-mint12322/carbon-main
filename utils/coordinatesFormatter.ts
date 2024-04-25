import { kml } from '@tmcw/togeojson';
import { DOMParser } from 'xmldom';

export interface GeoJSON {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
  id: string;
}

export interface Geometry {
  type: string;
  coordinates: Array<Array<number[]>> | Array<number[]>;
}

export interface Properties {
  name: string;
  visibility?: boolean;
  styleUrl: string;
  'fill-opacity': number;
  fill: string;
  'stroke-opacity': number;
  stroke: string;
  'stroke-width': number;
  'icon-offset': number[];
  'icon-offset-units': string[];
  icon: string;
}

export interface Coordinate {
  lat: number;
  lng: number;
  alt?: number;
}

export const convertKmlToGeoJson = async (filePath: string): Promise<GeoJSON | null> => {
  try {
    // read in our KML file and then parse it
    const response = await fetch(filePath);
    const responseData = await response.text();
    const geoJson = await kml(new DOMParser().parseFromString(responseData, 'text/xml'));

    return geoJson;
  } catch (error) {
    return null;
  }
};

export const coordinateArrayToCoordinateObjectArray = (
  coordinateArray: Array<number[]>,
): Array<Coordinate> | null => {
  if (coordinateArray && coordinateArray?.length > 0) {
    const coordinateObjectArray: Coordinate[] = coordinateArray?.map((coordinate) => {
      const [lng, lat, alt] = coordinate;
      return {
        lng,
        lat,
      };
    });
    return coordinateObjectArray;
  }
  return null;
};

export const coordinateStringToCoordinateObject = (
  coordinateString: string,
): Array<Coordinate[]> => {
  const data = coordinateString
    ?.trim()
    ?.split('|')
    ?.map((coordinatesArray: string) =>
      coordinatesArray?.split(' ').reduce((acc: Coordinate[], coordinates: string) => {
        const coordinatesData = coordinates?.split(',');
        if (coordinatesData.length > 0) {
          const [lng, lat] = coordinatesData;
          return [
            ...acc,
            {
              lat: parseFloat(lat),
              lng: parseFloat(lng),
            },
          ];
        }
        return acc;
      }, []),
    );

  return data;
};

export const coordinateObjectToCoordinateString = (
  coordinateObjectArray: Array<Coordinate[]>,
): string => {
  const coordinateString = coordinateObjectArray
    ?.map(
      (coordinatesArray) =>
        Array?.isArray(coordinatesArray) &&
        coordinatesArray?.map((data: Coordinate) => `${data?.lng},${data?.lat}`)?.join(' '),
    )
    ?.join('|');
  return coordinateString;
};

export const getCurrentLocation = async (): Promise<Coordinate> => {
  // Watch position function options for location precision.
  try {
    const options_current_location = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };
    if (navigator && navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = position.coords;
            resolve({
              lat: coords.latitude,
              lng: coords.longitude,
            });
          },
          (error) => {
            // See error code charts below.
            console.error(error.code, error.message);
            reject(error);
          },
          options_current_location,
        );
      });
    }
    return {
      lat: 0,
      lng: 0,
    };
  } catch (error) {
    console.error(error);
    return {
      lat: 0,
      lng: 0,
    };
  }
};

export const polygonToMapCenter = (polygon: Coordinate[]): Coordinate => {
  const { minLat, maxLat, minLng, maxLng } = getMinMaxBounds(polygon);

  const centerX = minLat + (maxLat - minLat) / 2;
  const centerY = minLng + (maxLng - minLng) / 2;

  return {
    lat: centerX,
    lng: centerY,
  };
};

export const getMinMaxBounds = (polygon: Coordinate[]): any => {
  const lat: number[] = polygon?.map((coordinate: Coordinate) => coordinate?.lat).sort();
  const lng: number[] = polygon?.map((coordinate: Coordinate) => coordinate?.lng).sort();

  const minLat = lat[0];
  const maxLat = lat[lat.length - 1];
  const minLng = lng[0];
  const maxLng = lng[lng.length - 1];

  return {
    minLat,
    maxLat,
    minLng,
    maxLng,
  };
};
