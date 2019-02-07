import * as Router from 'koa-router';

import { copy } from '../../controllers/utils/copy';
import { validate } from '../schemas';
import { serializeUser } from '../serialize/user';
import { updatePassword, sendEmail } from '../../controllers/user';
import { store as event } from '../../controllers/server-event';

const vid = validate.param('id', 'uuid');

function hidePassword(user) {
    if (user.password) {
      const u = copy(user);
      u.password = '@obfuscated@';
      return u;
    }
    return user;
  }

/**
 * User
 * Request handlers for password-reset.
 * @swagger
 *  tags: [UserPasswordReset]
 */

const router = new Router({ prefix: '/password-reset' });

/**
 * @route: /password-reset/{userMail}
 * @swagger
 *  operationId: passwordResetLink
 */
router.post('/', async function (ctx) {
  const { email } = ctx.request.body;
  const user = await sendEmail(email);

  event.register({
    type: 'user.passwordReset',
    authorizedUserId: null,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: null
  });

  ctx.body = '';

});

/**
 * @route: /password-reset/{userMail}
 * @swagger
 *  operationId: updatePassword
 */
router.post('/validate', async function (ctx) {
  const infoUpdatePassword = ctx.request.body;
  const user = await updatePassword(infoUpdatePassword);

  event.register({
    type: 'user.passwordUpdate',
    authorizedUserId: null,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: hidePassword(user)
  });

  ctx.body = serializeUser(user);

});

export { router };
