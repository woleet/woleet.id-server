import * as Router from 'koa-router';

import { copy } from '../../controllers/utils/copy';
import { validate } from '../schemas';
import { serializeUser } from '../serialize/user';
import { updatePassword } from '../../controllers/user';
import { sendEmail } from '../../controllers/send-email';
import { store as event } from '../../controllers/server-event';
import { BadRequest, Unauthorized, NotFound } from 'http-errors';

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
 * @route: /password-reset
 * @swagger
 *  operationId: passwordResetLink
 */
router.post('/', async function (ctx) {
  const { email } = ctx.request.body;
  let user;

  if (!email) {
    throw new BadRequest('Need to send the email adresse.');
  }

  try {
    user = await sendEmail(email, ctx.header.referer);
  } catch {
    throw new NotFound(email + ' does not correspond to a user.');
  }

  event.register({
    type: 'user.edit',
    authorizedUserId: null,
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
    throw new BadRequest('Need to send the email adresse.');
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
