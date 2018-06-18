import * as express from "express";
import { router as auth } from "./authentication"
import { router as user } from "./user"
import { router as key } from "./key"

const router = express.Router();

/**
 * Route : /
 */
router.get('/', function (req, res, next) {
  res.json({ message: 'welcome' });
});

router.use(auth);
router.use('/user', user);
router.use('/key', key);

export { router as api };
