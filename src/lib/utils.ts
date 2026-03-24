export const kmhToKnots = (kmh: number): number => Math.round(kmh / 1.852);

export const degreesToCardinal = (deg: number | null | undefined): string => {
  if (deg === null || deg === undefined || deg < 0) return 'VRB';
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
  return dirs[Math.round(deg / 22.5) % 16];
};
