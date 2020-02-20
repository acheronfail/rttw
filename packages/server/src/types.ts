import { IncomingMessage, Server, ServerResponse } from 'http';
import { Store } from './store';

// NOTE: this isn't a nice way to do this since we override the global namespace,
// but fastify's types aren't very friendly to use, so this is the way it is for now.
declare module 'fastify' {
  export interface FastifyInstance<HttpServer = Server, HttpRequest = IncomingMessage, HttpResponse = ServerResponse> {
    // Add in our decorators.
    store: Store;
  }
}
