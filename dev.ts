import { App } from './src/app.ts';
import { Server } from './src/server.ts';

const app = new App()
  .app(
    '/redirect',
    new App().get('/:id', (ctx) => ctx.redirect('https://google.com'))
  )
  .app(
    '/files',
    new App().get('/logo', async (ctx) => {
      const path = `${import.meta.dirname}/data/riadh.png`;

      const file = await Deno.readFile(path);

      ctx.blob(file, { headers: { 'Content-Type': 'image/png' } });
    })
  );

const server = new Server([app]);

Deno.serve({
  port: 8000,
  handler: (req, info) => server.handler(req, info),
});

server.trie.root.print();
