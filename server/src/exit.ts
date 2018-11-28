import * as log from 'loglevel';

export function exit(msg, err) {
  log.error(msg);
  log.error('Full trace is:', err);
  process.exit(1);
}
