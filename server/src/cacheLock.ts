import { cacheConfig } from './config';
import { exit } from './exit';
import { logger } from './config';
import * as Redis from 'ioredis';
import * as Redlock from 'redlock';
import * as NodeCache from 'node-cache';
import * as Debug from 'debug';
import { reloadServerConfig } from './controllers/server-config';

const debug = Debug('id:ctrl:cachelock');

export class CacheLock {
  redis: Redis = undefined;
  redisSub: Redis = undefined;
  localCache: NodeCache = undefined;

  updateChannel = 'updateServerConfig';

  constructor() {
    switch (cacheConfig.type) {
      case 'local': {
        this.localCache = new NodeCache();
        break;
      }
      case 'redis': {
        this.redis = new Redis(cacheConfig.port, cacheConfig.host);
        this.redisSub = new Redis(cacheConfig.port, cacheConfig.host, { maxRetriesPerRequest: null });
        this.redisSub.subscribe(this.updateChannel);
        this.redisSub.on('message', async (channel, message) => {
          if (channel === this.updateChannel && message === 'update') {
            debug('Receiving reload config signal');
            await reloadServerConfig();
          }
        });
        break;
      }
      default: {
        exit(`Invalid cache type: ${cacheConfig.type}`, '');
        break;
      }
    }
  }

  async publishReloadServerConfig() {
    debug('Sending reload to other servers, if any');
    switch (cacheConfig.type) {
      case 'local': {
        break;
      }
      case 'redis': {
        debug('Sending reload to redis');
        await this.redisSub.unsubscribe(this.updateChannel);
        await this.redis.publish(this.updateChannel, 'update');
        await this.redisSub.subscribe(this.updateChannel);
        break;
      }
      default: {
        exit(`Invalid cache type: ${cacheConfig.type}`, '');
        break;
      }
    }
  }

  // This function is to be used when a function must be run only one at a time in a cluster environment
  // (when there is only one server (redis not configured) this function does not lock anything)
  async doLockByCache(lockName: string, functionToCall: () => any, retryCount = -1) {
    switch (cacheConfig.type) {
      case 'local': {
        await functionToCall();
        break;
      }
      case 'redis': {
        // Here redlock is configured to retry indefinitely when trying to get a lock.
        try {
          const redlock = new Redlock([this.redis], { retryCount });
          logger.info(`Trying to take redis lock: ${lockName}`);
          const lock = await redlock.lock(lockName, 5 * 60 * 1000); // TTL is 5 minutes, after this delay this lock will be destroyed
          await functionToCall();
          logger.info(`Releasing redis lock: ${lockName}`);
          lock.unlock();
        } catch (err) {
          logger.info(`The redis lock for ${lockName} is already taken`);
        }
        break;
      }
      default: {
        exit(`Invalid cache type: ${cacheConfig.type}`, '');
        break;
      }
    }
  }
}

export const cacheLock = new CacheLock;
