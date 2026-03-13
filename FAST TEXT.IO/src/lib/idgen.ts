import { nanoid } from 'nanoid';

export const generateId = (length = 8): string => {
  return nanoid(length);
};
