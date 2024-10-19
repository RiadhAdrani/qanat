import { App } from './src/app.ts';
import { Server } from './src/server.ts';

const app = new App()
  .middleware(async (_ctx, next) => {
    console.log('start middleware 1');
    await next();
    console.log('end middleware 1');
  })
  .get('/', (ctx) => {
    console.log('/hello world');
    ctx.json('hello world', {});
  });

const server = new Server([app]);

Deno.serve({
  port: 8000,
  handler: (req, info) => server.handler(req, info),
});

server.routes.forEach((endpoint) => {
  console.log(`${endpoint.method.padEnd(5)} ${endpoint.path}`);
});
