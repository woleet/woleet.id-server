require('express-async-errors');

import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

import { NotFoundError } from "http-typed-errors/lib";

import { api } from './api/root';

var swagger = require('swagger-express');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(api);

// 404
app.use(() => {
    throw new NotFoundError;
});

app.use((err, req, res, next) => {
    let error;
    if (err && err.statusCode && err.name) {
        error = { message: err.message, statusCode: err.statusCode };
    } else {
        console.error(err);
        error = { message: 'Internal Server Error', statusCode: 500 };
    }

    res.status(error.statusCode).json({ error })
});

export default app;
