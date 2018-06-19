import { RequestHandler, Request, Response, NextFunction } from "express";

export interface AsyncRequestHandler extends RequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

export interface UserObject {
  type?: 'user' | 'admin',
  status?: 'active' | 'locked' | 'disabled',
  email?: string,
  username: string,
  firstName: string,
  lastName: string,
  password: string
}
