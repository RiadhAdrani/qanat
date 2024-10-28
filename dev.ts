import { App, Server } from './src/classes/mod.ts';

const app = new App()
  .middleware(async (ctx, next) => {
    ctx.set('user', 'riadh');

    await next();
  })
  .get('/ping', (ctx) => {
    console.log(ctx.get('user'));

    ctx.send(new Response('hello world'));
  });

const server = new Server([app]);

Deno.serve({
  port: 8000,
  handler: (req, info) => server.handler(req, info),
});

server.trie.root.print();
