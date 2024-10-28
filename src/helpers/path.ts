export const resolvePath = (items: Array<string>): string => {
  return items.join('/').replaceAll(/(\/)+/g, '/');
};

export const resolveSegments = (path: string) => {
  return ['', ...path.split('/').filter(Boolean)];
};
