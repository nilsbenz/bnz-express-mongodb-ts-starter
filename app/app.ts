import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import logger from 'morgan';
import { Response, Errback } from 'express-serve-static-core/index';
const Data = require('./data');

const dbRoute = 'mongodb+srv://tbz-133-notes:D41FWad7IF716P3B@cluster0-lmppk.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', (): void => console.log('connected to the database'));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app: express.Application = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.get('/', (req, res): void => {
  Data.find((err: Errback, data: typeof Data): Response => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

app.post('/', (req, res): Response | void => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.message = message;
  data.id = id;
  data.save((err: Errback): Response => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.listen(3000, (): void => {
  console.log('listening on port 3000');
});