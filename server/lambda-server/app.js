import path from 'path';
import http from 'http';
import express from 'express';
import lambdaMiddleware from './lambdaMiddleware';

let app = express();
app.use(express.static(path.join(__dirname, '../static')));
app.use(lambdaMiddleware);

let server = http.createServer(app);

export default server;
