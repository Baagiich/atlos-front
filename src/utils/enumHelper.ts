export function getKeys(type: any) {
  return Object.keys(type).filter((v) => isNaN(Number(v)));
}

export function getValues(type: any) {
  return getKeys(type).map((key) => type[key]);
}

export function getMap(type: any) {
  return getKeys(type).map((key) => ({
    key,
    value: !isNaN(Number(type[key])) ? Number(type[key]) : type[key],
  }));
}