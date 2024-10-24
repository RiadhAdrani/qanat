import { App } from './src/app.ts';
import { Server } from './src/server.ts';

const app = new App()
  .middleware(async (_ctx, next) => {
    console.log('start middleware 1');
    await next();
    console.log('end middleware 1');
  })
  .get('/', (ctx) => ctx.text('GET /', {}))
  .post('/', (ctx) => ctx.text('POST /', {}))
  .app(
    '/api',
    new App()
      .get('/', (ctx) => ctx.text('GET /api', {}))
      .post('/', (ctx) => ctx.text('POST /api', {}))
      .put('/', (ctx) => ctx.text('PUT /api', {}))
      .get('/users', (ctx) => ctx.text('GET /api/users', {}))
  );

const server = new Server([app]);

Deno.serve({
  port: 8000,
  handler: (req, info) => server.handler(req, info),
});

server.trie.root.print();
