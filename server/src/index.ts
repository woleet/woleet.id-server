import * as Debug from 'debug';
import * as assert from 'assert';

import app from './app';

const debug = Debug('id:server');

const port = parseInt(process.env.PORT || '3000');

assert(Number.isInteger(port), 'Port should be an integer');

const server = app.listen(port);

server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', () => debug(`Listening on ${port}`));
