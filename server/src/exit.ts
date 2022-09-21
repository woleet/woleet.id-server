import { logger } from './config';

export function exit(msg, err) {
  logger.error(msg);
  logger.error('Full trace is:', err);
  process.exit(1);
}
