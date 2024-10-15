export const resolvePath = (items: Array<string>): string => {
  return items.join('/').replace(/^\//, '');
};

export const resolveSegments = (path: string) => {
  return path.split('/').filter(Boolean);
};
