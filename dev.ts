import { App } from './src/app.ts';
import { Server } from './src/server.ts';

const app = new App()
  .middleware(async (_ctx, next) => {
    console.log('start middleware 1');
    await next();
    console.log('end middleware 1');
  })
  .get('/', (ctx) => ctx.text('GET /', {}))
  .get('/google', (ctx) => ctx.redirect('https://google.com'))
  .app(
    '/:api',
    new App()
      .middleware(async (_ctx, next) => {
        console.log('start api middleware ');
        console.log(_ctx.params);
        await next();
        console.log('end api middleware ');
      })
      .get('/:another-one', (ctx) => ctx.text('GET: This is the api', {}))
  );

const server = new Server([app]);

Deno.serve({
  port: 8000,
  handler: (req, info) => server.handler(req, info),
});

server.trie.root.print();
