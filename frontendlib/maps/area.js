import { computeArea } from 'spherical-geometry-js';

export const polygonArea = (path) => {
  // Array of geo coordinates
  const m2 = computeArea(path); // sq. meters
  return {
    sqMeters: m2.toFixed(2),
    hectares: (m2 * 0.0001).toFixed(2),
    acres: (m2 * 0.00024710882).toFixed(2),
  };
};
