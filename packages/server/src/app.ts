import http from 'http';
import fastify from 'fastify';
import { apiPuzzlesRoute } from './routes/api-puzzles-id';
import { apiSubmitRoute } from './routes/api-submit';
import { Store } from './store';

// TODO: is there a better way to do this?
declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = http.Server,
    HttpRequest = http.IncomingMessage,
    HttpResponse = http.ServerResponse
  > {
    store: Store;
  }
}

export async function createServer(store: Store) {
  const f = fastify({ logger: { prettyPrint: true } });
  f.decorate('store', store);
  f.route(apiPuzzlesRoute);
  f.route(apiSubmitRoute);

  return f;
}
