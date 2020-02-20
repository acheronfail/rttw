import { IncomingMessage, Server, ServerResponse } from 'http';
import fastify from 'fastify';

export type RouteOptions<Q, P, H, B> = fastify.RouteOptions<Server, IncomingMessage, ServerResponse, Q, P, H, B>;
