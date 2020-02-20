import fastify from 'fastify';
import { apiPuzzlesRoute } from './routes/api-puzzles';
import { apiSubmitRoute } from './routes/api-submit';
import { Store } from './store';

export async function createServer(store: Store) {
  const f = fastify({ logger: { prettyPrint: process.env.NODE_ENV === 'development' } });
  f.decorate('store', store);
  f.route(apiPuzzlesRoute);
  f.route(apiSubmitRoute);

  return f;
}
