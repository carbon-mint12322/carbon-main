export const calculatePolygonArea = (p: any) => {
  if (!p?.paths) return null;
  // eslint-disable-next-line no-undef
  const objPolygon = new google.maps.Polygon(p);
  // eslint-disable-next-line no-undef
  const m2 = google.maps.geometry.spherical.computeArea(objPolygon.getPath());
  const acres = m2 * 0.000247105;
  return acres;
};
