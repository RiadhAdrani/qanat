import { App, AppItemType, type AppEndpoint } from './src/app.ts';

const app = new App().route('GET', '/', () => 'hello world').app('/users', new App());

Deno.serve({
  port: 8000,
  handler: async (req) => {
    const pathname = new URL(req.url).pathname;
    const method = req.method;

    const endpoint = app.items.find(
      (item) => item.type === AppItemType.Endpoint && item.path === pathname && item.method === method
    ) as AppEndpoint | undefined;

    if (!endpoint) {
      return new Response('not found', { status: 404 });
    }

    let html = undefined;

    for (const handler of endpoint.handlers) {
      html = await handler(req);
    }

    console.log(html);

    return new Response(JSON.stringify(html), { status: 200, headers: { 'content-type': 'application/json' } });
  },
});
