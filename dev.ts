import { App } from './src/app.ts';
import { Server } from './src/server.ts';

const app = new App().get('/', () => 'hello world').get('/ping', () => console.log('ping'));

const server = new Server([app]);

Deno.serve({
  port: 8000,
  handler: server.getHandler(),
});

server.routes.forEach((endpoint) => {
  console.log(`${endpoint.method.padEnd(5)} ${endpoint.path}`);
});
