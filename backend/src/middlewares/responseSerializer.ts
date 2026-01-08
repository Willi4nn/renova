import type { NextFunction, Request, Response } from 'express';

export const responseSerializer = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const originalJson = res.json;
  res.json = function (data) {
    const serialize = (obj: unknown): unknown => {
      if (obj === null || obj === undefined) return obj;

      if (
        typeof obj === 'object' &&
        'toNumber' in obj &&
        typeof obj.toNumber === 'function'
      ) {
        return obj.toNumber();
      }

      if (obj instanceof Date) {
        const hours = obj.getUTCHours();
        const minutes = obj.getUTCMinutes();
        const seconds = obj.getUTCSeconds();
        const ms = obj.getUTCMilliseconds();

        if (hours === 0 && minutes === 0 && seconds === 0 && ms === 0) {
          return obj.toISOString().split('T')[0];
        }

        const adjusted = new Date(obj);
        adjusted.setHours(adjusted.getHours() - 3);
        return adjusted;
      }

      if (Array.isArray(obj)) return obj.map(serialize);

      if (typeof obj === 'object') {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, serialize(v)]),
        );
      }

      return obj;
    };
    return originalJson.call(this, serialize(data));
  };
  next();
};
