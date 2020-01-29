import { sequelize } from '../../database/sequelize';
import { ServiceUnavailable } from 'http-errors';
import * as Router from 'koa-router';

/**
 * Healthcheck
 */

const router = new Router();

/**
 * @route: /check
 */
router.get('/check', async function (ctx) {
  let response;
  await sequelize.authenticate().catch(error => response = error);

  if (response) {
    throw new ServiceUnavailable();
  }

  ctx.body = { response: 'ok' };
});

export { router };
