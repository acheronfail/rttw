import bodyParser from 'body-parser';
import express from 'express';
import { apiPuzzlesId } from './routes/api-puzzles-id';
import { apiSubmit } from './routes/api-submit';
import { Store } from './store';

export async function createExpressApp(store: Store) {
  const app = express();
  app.use(bodyParser.json());
  app.set('port', process.env.PORT || 3001);

  // Routes.
  app.get('/api/puzzles/:id?', apiPuzzlesId(store));
  app.post('/api/submit', apiSubmit(store));

  return app;
}
