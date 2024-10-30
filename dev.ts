import { App, Server, Socket } from './src/classes/mod.ts';

const app = new App()
  .middleware(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      console.log(error);

      ctx.send(
        new Response(['<h1>Someting went wrong</h1>', `<p>${error}</p>`].join(''), {
          status: 500,
          headers: { 'Content-Type': 'text/html' },
        })
      );
    }
  })
  .get('/ping', (ctx) => {
    ctx.send(new Response('hello world'));
  })
  .get('/error', () => {
    throw new Error('error');
  });

const socket = new Socket('/ws').socket(
  '/users/:id',
  new Socket().onOpen((ctx, ev) => {
    console.log(ev);
    console.log(ctx.params);

    ctx.send(JSON.stringify(ctx.params));
  })
);

const server = new Server([app, socket]);

Deno.serve({
  port: 8000,
  handler: (req, info) => server.handler(req, info),
});

server.http.root.print();
