export const extractFields = <T>(o: T, data: any): T => {

  if (!data) {
    return o;
  }

  const obj = o as any;
  for (const k of Object.keys(obj)) {
    if (data[k] === null && data[k] === undefined) {
      continue;
    }

    const val = data[k];
    const myval = obj[k];


    if (isPlainObj(myval)) {
      const res = extractFields(myval, val);
      obj[k] = res;
      continue;
    }

    obj[k] = data[k];
  }

  obj.id = obj._id || obj.id;

  o = obj;
  return o;
};

export const isPlainObj = (o: any) => {
  let result = o && o.constructor && o.constructor.prototype && o.constructor.prototype.hasOwnProperty("isPrototypeOf");
  result = Boolean(result);
  return result;
};

export const flattenObj = (obj: any, keys: string[] = []): any => {
  return Object.keys(obj).reduce((acc, key) => {
    const val = obj[key];
    const check = isPlainObj(val) || (!isPrimitive(val)) && !Array.isArray(val);
    return Object.assign(acc, check
      ? flattenObj(obj[key], keys.concat(key))
      : { [keys.concat(key).join(".")]: obj[key] }
    );
  }, {});
};

export const isPrimitive = (test: any) => {
  return test !== Object(test);
};
