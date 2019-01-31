import * as Router from 'koa-router';

import { copy } from '../../controllers/utils/copy';
import { validate } from '../schemas';
import { checkTokenValidity, sendEmail, updateUser } from '../../controllers/user';
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
router.post('/', vid, async function (ctx) {
  const { userMail } = ctx.request.body;
  const user = await sendEmail(userMail);

  event.register({
    type: 'user.passwordReset',
    authorizedUserId: null,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: null
  });
});

/**
 * @route: /password-reset/{userMail}
 * @swagger
 *  operationId: updatePassword
 */
router.post('/validate', vid, async function (ctx) {
  const updatePassword = ctx.request.body;
  let user = await checkTokenValidity(updatePassword);


  user = await updateUser(user.id, user);

  event.register({
    type: 'user.passwordUpdate',
    authorizedUserId: null,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: hidePassword(user)
  });

});

export { router };
