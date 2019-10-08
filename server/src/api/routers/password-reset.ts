import * as Router from 'koa-router';

import { copy } from '../../controllers/utils/copy';
import { serializeUser } from '../serialize/user';
import { updatePassword } from '../../controllers/user';
import { sendResetPasswordEmail } from '../../controllers/send-email';
import { store as event } from '../../controllers/server-event';
import { BadRequest, NotFound, Unauthorized } from 'http-errors';

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
 * @route: /password-reset
 * @swagger
 *  operationId: passwordResetLink
 */
router.post('/', async function (ctx) {
  const managerId = ctx.session ? ctx.session.user.get('id') : null;
  const { email } = ctx.request.body;
  if (!email) {
    throw new BadRequest('Need to send the email address.');
  }

  let user;
  try {
    user = await sendResetPasswordEmail(email, managerId);
  } catch {
    throw new NotFound(email + ' does not correspond to a user.');
  }

  event.register({
    type: 'user.edit',
    authorizedUserId: managerId,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: null
  });

  ctx.body = '';

});

/**
 * @route: /password-reset
 * @swagger
 *  operationId: updatePassword
 */
router.post('/validate', async function (ctx) {
  const infoUpdatePassword = ctx.request.body;
  let user;
  if (!infoUpdatePassword.email) {
    throw new BadRequest('Need to send the email address.');
  }
  if (!infoUpdatePassword.token) {
    throw new BadRequest('Need to send the reset token.');
  }
  if (!infoUpdatePassword.password) {
    throw new BadRequest('Need to send the new password.');
  }

  try {
    user = await updatePassword(infoUpdatePassword);
  } catch (err) {
    throw new Unauthorized('Invalid token.');
  }

  event.register({
    type: 'user.edit',
    authorizedUserId: null,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: hidePassword(user)
  });

  ctx.body = serializeUser(user);

});

export { router };
