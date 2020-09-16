import { Sequelize } from "sequelize";
import { cacheConfig } from "./config";
import { exit } from './exit';
import * as log from 'loglevel';
import * as Redis from 'ioredis';
import * as Redlock from 'redlock';

export async function doLockByCache(lockName: string, functionToCall: () => any) {
  switch (cacheConfig.type) {
    case 'local': {
      await functionToCall();
      break;
    }
    case 'redis': {
      const redis = new Redis(cacheConfig.port, cacheConfig.host);
      const redlock = new Redlock([redis], {retryCount: -1});
      log.info(`Trying to take redis lock: ${lockName}`);
      const lock = await redlock.lock(lockName, 5 * 60 * 1000); // TTL is 5 minutes
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
