/* global google */
import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Marker,
  Polygon,
  MarkerProps,
  PolygonProps,
  GoogleMap,
  GoogleMapProps,
  InfoWindow,
  KmlLayer,
} from '@react-google-maps/api';
import { LatLngLiteral } from 'spherical-geometry-js';
import { useTheme } from '@mui/material/styles';
import { polygonToMapCenter, Coordinate, getMinMaxBounds } from '~/utils/coordinatesFormatter';

export interface IMarkerProps<T> extends Omit<MarkerProps, 'position'> {
  id?: number | string;
  data?: T;
  color?: string;
  title?: string;
  subTexts?: string[];
  tags?: string[];
  position: Coordinate;
}

interface IData {
  [key: string]: any;
}

interface CustomPolygonProps<T = any> extends PolygonProps {
  paths?: Coordinate[][] | undefined;
  path?: Coordinate[] | undefined;
  id?: number;
  data?: T;
}

interface IProps<T> {
  height?: string;
  width?: string;
  markers?: IMarkerProps<T>[];
  polygons?: CustomPolygonProps<T>[];
  mapProps?: GoogleMapProps;
  onMapClick?: (coordinates: LatLngLiteral | undefined) => void;
  markerToolTip?: (marker: IMarkerProps<T>) => JSX.Element;
  isTooltipPresent?: boolean;
  enableZoom?: boolean;
  kmlUrl?: string;
  rowIndex?: number;
  polygonToolTip?: (polygon?: CustomPolygonProps<T>) => JSX.Element;
  onPolygonClick?: (polygon?: CustomPolygonProps<T>) => void;
  inactivePolygons?: any;
}

export default function Map<T = IData>(props: IProps<T>) {
  const theme = useTheme();
  const mapRef: any = useRef(null);
  const {
    markers,
    polygons,
    mapProps,
    height = '100%',
    width = '100%',
    markerToolTip = (marker) => null,
    isTooltipPresent = false,
    enableZoom = true,
    kmlUrl,
    rowIndex,
    polygonToolTip = (polygon) => null,
    onPolygonClick = (polygon) => null,
    inactivePolygons,
  } = props;

  const [temp, setTemp] = useState<any>();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [showToolTip, setShowToolTip] = useState<number | string | null>(null);

  useEffect(() => {
    if (enableZoom) {
      zoomLevelWithFirstPolygon();
    } else {
      zoomLevelWithAllPolygons();
    }
  }, [polygons, markers, rowIndex]);

  const handleMouseOver = (id?: number | string) => {
    id && setShowToolTip(id);
  };
  const handleMouseExit = () => {
    setShowToolTip(null);
  };

  const centerCoordinate: Coordinate = useMemo(() => {
    const coordinates =
      polygons && polygons?.length > 0
        ? Array?.isArray(polygons?.[rowIndex || 0]?.paths?.[0])
          ? polygons?.[rowIndex || 0]?.paths?.[0]
          : polygons?.[rowIndex || 0]?.path
        : markers && markers?.length > 0
          ? markers?.map((marker: IMarkerProps<T>) => marker?.position)
          : [];
    setTemp(coordinates);
    return polygons && polygons?.length > 0 && coordinates
      ? polygonToMapCenter(coordinates as Coordinate[])
      : { lat: 20.59, lng: 78.96 };
  }, [polygons, markers, rowIndex]);

  const zoomLevelWithFirstPolygon = () => {
    const coordinates =
      polygons && polygons?.length > 0
        ? Array?.isArray(polygons?.[rowIndex || 0]?.paths?.[0])
          ? polygons?.[rowIndex || 0]?.paths?.[0]
          : polygons?.[rowIndex || 0]?.path
        : markers && markers?.length > 0
          ? markers?.map((marker: IMarkerProps<T>) => marker?.position)
          : [];

    return coordinates && coordinates?.length > 0
      ? polygonToZoom(coordinates as Coordinate[])
      : undefined;
  };

  const zoomLevelWithAllPolygons = (): number | undefined => {
    const coordinates: Coordinate[] = [];

    if (polygons && polygons.length > 0) {
      polygons.forEach((polygon) => {
        const paths = Array.isArray(polygon?.paths?.[0]) ? polygon?.paths?.[0] : polygon?.path;
        if (paths) {
          paths.forEach((coord) => {
            coordinates.push(coord as Coordinate);
          });
        }
      });
    }

    if (markers && markers.length > 0) {
      markers.forEach((marker) => {
        coordinates.push(marker?.position);
      });
    }

    return coordinates.length > 0 ? polygonToZoom(coordinates) : undefined;
  };

  const polygonToZoom = (polygon: Coordinate[]) => {
    const { minLat, maxLat, minLng, maxLng } = getMinMaxBounds(polygon);
    return (
      mapRef?.current &&
      polygon &&
      polygon?.length > 0 &&
      mapRef?.current?.fitBounds(
        new google.maps.LatLngBounds(
          new google.maps.LatLng(minLat, minLng),
          new google.maps.LatLng(maxLat, maxLng),
        ),
      )
    );
  };

  return (
    <>
      <GoogleMap
        id='map'
        onClick={(e) => props?.onMapClick?.(e.latLng?.toJSON())}
        mapContainerStyle={{ height, width }}
        zoom={mapProps?.zoom || 8}
        onLoad={(map) => {
          mapRef.current = map;
          if (enableZoom) {
            zoomLevelWithFirstPolygon();
          } else {
            zoomLevelWithAllPolygons();
          }

          setMapLoaded(true);
        }}
        center={mapProps?.center || centerCoordinate}
        mapTypeId='satellite'
        {...mapProps}
      >
        {polygons?.map?.((polygon: CustomPolygonProps, index: number) => (
          <>
            <Polygon
              key={`Polygon-${index}`}
              {...polygon}
              onMouseOver={() => handleMouseOver(polygon?.id)}
              onMouseOut={() => handleMouseExit()}
              onClick={() => onPolygonClick(polygon)}
            />
            {isTooltipPresent ? (
              <Marker
                position={polygonToMapCenter((polygon?.paths?.[0] || []) as Coordinate[])}
                visible={false}
              >
                {mapLoaded && polygon?.id === showToolTip && isTooltipPresent ? (
                  <InfoWindow>{polygonToolTip({ id: polygon?.id, ...polygon })}</InfoWindow>
                ) : null}
              </Marker>
            ) : null}
          </>
        ))}
        {inactivePolygons?.map?.((polygon: CustomPolygonProps, index: number) => (
          <>
            <Polygon key={`Polygon-${index}`} {...polygon} />
          </>
        ))}

        {markers?.map?.((marker: IMarkerProps<T>, index: number) => (
          <Marker
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7.87-7 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: marker?.color || theme.palette.mapMarker.main,
              fillOpacity: 0.8,
              scale: 1.2,
              anchor: {
                equals(other: null) {
                  return false;
                },
                x: 12,
                y: 24,
              },
            }}
            key={`Marker-${index}`}
            onMouseOver={() => handleMouseOver(marker?.id)}
            onMouseOut={() => handleMouseExit()}
            {...marker}
          >
            {mapLoaded && marker?.id === showToolTip && isTooltipPresent ? (
              <InfoWindow>{markerToolTip({ id: marker?.id, ...marker })}</InfoWindow>
            ) : null}
          </Marker>
        ))}
        {kmlUrl && <KmlLayer url={kmlUrl} options={{ preserveViewport: false }} />}
      </GoogleMap>
    </>
  );
}
