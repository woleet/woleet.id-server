import { Request, Response, NextFunction, Router } from "express";
import { NotImplementedError } from "http-typed-errors";

/**
 * Authentification
 * Request handlers for authentication.
 * @swagger
 *  tags: [authentication]
 */

const router = Router();

/**
 * @route: /login
 * @swagger
 *  operationId: login
 */
router.get('/login', async function (req, res, next) {
  throw new NotImplementedError();
});

/**
 * @route: /logout
 * @swagger
 *  operationId: logout
 */
router.get('/logout', function (req, res, next) {
  throw new NotImplementedError();
});

export { router };
