import React from 'react';
import { QRMapWithMarkers } from '~/frontendlib/QR/QRMapWithMarkers';
import { Coordinate } from '~/utils/coordinatesFormatter';
const { renderToStaticMarkup } = require('react-dom/server');

/** */
export function getMapHtml(nestedCoordinates: Coordinate[][], markers: Coordinate[]) {
  return renderToStaticMarkup(
    React.createElement(QRMapWithMarkers, { nestedCoordinates, markers }, []),
  );
}
