import path from 'path';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser'
import lambdaMiddleware, {urlsToMonitor} from './lambdaMiddleware';

let app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, '../static')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(lambdaMiddleware);

app.get('/', function(req, res){
  res.render('index', { foo: 'bar' });
});

let server = http.createServer(app);

export default server;
