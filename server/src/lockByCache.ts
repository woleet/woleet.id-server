import { cacheConfig } from './config';
import { exit } from './exit';
import * as log from 'loglevel';
import * as Redis from 'ioredis';
import * as Redlock from 'redlock';

// This function is to be used when a function must be run only one at time in a cluster environnement
// when there is only one server (redis not configured) this function does not lock anything
export async function doLockByCache(lockName: string, functionToCall: () => any) {
  switch (cacheConfig.type) {
    case 'local': {
      await functionToCall();
      break;
    }
    case 'redis': {
      const redis = new Redis(cacheConfig.port, cacheConfig.host);
      // Here redlock is configured to retry indefinitly when trying to get a lock.
      const redlock = new Redlock([redis], {retryCount: -1});
      log.info(`Trying to take redis lock: ${lockName}`);
      const lock = await redlock.lock(lockName, 5 * 60 * 1000); // TTL is 5 minutes,  after this delay this lock will be destroyed
      await functionToCall();
      log.info(`Releasing redis lock: ${lockName}`);
      lock.unlock();
      redis.quit();
      break;
    }
    default: {
      exit(`Invalid cache type: ${cacheConfig.type}`, '');
      break;
    }
  }
}
