import { Request } from 'express';

/**
 * Extended Express Request type with additional properties
 */
export interface ExtendedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}
