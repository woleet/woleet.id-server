import { RequestHandler, Request, Response, NextFunction } from "express";

export interface AsyncRequestHandler extends RequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}
