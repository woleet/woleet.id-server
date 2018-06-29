
import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as morgan from 'koa-morgan';
import * as bodyParser from 'koa-bodyparser';
import { api } from './api/';
import { errorHandler } from './api/error';
export const app = new Koa();

app.use(cors({ credentials: true }));
app.use(errorHandler);

app.use(morgan('dev'));
app.use(bodyParser());

app.use(api.routes());

app.on('error', async (err, ctx) => {
  console.log('errrr', err);
});

export default app;
