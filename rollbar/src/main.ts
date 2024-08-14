import express, { NextFunction, Request, Response } from 'express';
import { getRollbar } from './getRollbar.js';

const rollbar = await getRollbar();

const PORT = 3000;

const app = express();

app.get('/', async (req, res) => {
  res.send(JSON.stringify('success'));
});

app.get('/error', () => {
  throw new Error('test error');
});

// Middleware to send exceptions to Rollbar. MUST come after all other
// middleware / API methods have been set up.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  rollbar.error(err);
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
  rollbar.log('App started up');
});
