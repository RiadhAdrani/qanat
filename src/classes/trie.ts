import { resolveSegments } from '../helpers/mod.ts';
import type { Method, HttpHandler, RouteParameters, SocketHandler } from '../types/mod.ts';

export type FindHttpTrieResult = {
  trie: HttpTrieNode;
  method: Method;
  handler: HttpHandler;
  params: RouteParameters;
};

export type FindSocketTrieResult = {
  trie: SocketTrieNode;
  handlers: Array<SocketHandler>;
  params: RouteParameters;
};

export class HttpTrie {
  root = new HttpTrieNode('');

  constructor() {}

  add(method: Method, segments: Array<string>, hanlder: HttpHandler): void {
    if (segments.length === 1) {
      this.root.addMethod(method, hanlder);
      return;
    }

    let currentNode = this.root;

    for (let i = 1; i < segments.length; i++) {
      let next = currentNode?.nodes.get(segments[i]);
      if (!next) {
        next = new HttpTrieNode(segments[i]);
        currentNode?.nodes.set(segments[i], next);
      }

      currentNode = next;

      if (i === segments.length - 1) {
        currentNode?.addMethod(method, hanlder);
      }
    }
  }

  find(method: Method, path: string): FindHttpTrieResult | undefined {
    const segments = resolveSegments(path);

    let node: HttpTrieNode | undefined;

    const params: Record<string, string | undefined> = {};

    if (segments.length === 1) {
      node = this.root;
    } else {
      let current = this.root;

      for (let i = 1; i < segments.length; i++) {
        let targetNode = current.nodes.get(segments[i]);

        if (!targetNode) {
          const result = current.nodes.entries().find(([_key, node]) => node.isDynamic);

          if (result) {
            const key = result[0].slice(1);
            params[key] = segments[i];

            targetNode = result[1];
          }
        }

        if (!targetNode) {
          return undefined;
        }

        current = targetNode;
      }

      node = current;
    }

    if (!node) {
      return undefined;
    }

    const handler = node.findMethod(method);

    if (!handler) {
      return undefined;
    }

    return { method: handler.method, handler: handler.handler, params, trie: node };
  }
}

export class SocketTrie {
  root = new SocketTrieNode('');

  constructor() {}

  add(segments: Array<string>, hanlder: SocketHandler): void {
    if (segments.length === 1) {
      this.root.addHandler(hanlder);
      return;
    }

    let currentNode = this.root;

    for (let i = 1; i < segments.length; i++) {
      let next = currentNode?.nodes.get(segments[i]);
      if (!next) {
        next = new SocketTrieNode(segments[i]);
        currentNode?.nodes.set(segments[i], next);
      }

      currentNode = next;

      if (i === segments.length - 1) {
        currentNode?.addHandler(hanlder);
      }
    }
  }

  find(path: string): FindSocketTrieResult | undefined {
    const segments = resolveSegments(path);

    let node: SocketTrieNode | undefined;

    const params: Record<string, string | undefined> = {};

    if (segments.length === 1) {
      node = this.root;
    } else {
      let current = this.root;

      for (let i = 1; i < segments.length; i++) {
        let targetNode = current.nodes.get(segments[i]);

        if (!targetNode) {
          const result = current.nodes.entries().find(([_key, node]) => node.isDynamic);

          if (result) {
            const key = result[0].slice(1);
            params[key] = segments[i];

            targetNode = result[1];
          }
        }

        if (!targetNode) {
          return undefined;
        }

        current = targetNode;
      }

      node = current;
    }

    if (!node) {
      return undefined;
    }

    return { params, trie: node, handlers: node.handlers };
  }
}

export class HttpTrieNode {
  key: string;
  nodes: Map<string, HttpTrieNode> = new Map();
  methods: Map<Method, { method: Method; handler: HttpHandler }> = new Map();
  isDynamic = false;

  constructor(key: string) {
    this.key = key;

    if (key.startsWith(':')) {
      this.isDynamic = true;
    }
  }

  addNode(key: string): HttpTrieNode {
    if (this.nodes.has(key)) {
      return this.nodes.get(key)!;
    }

    const node = new HttpTrieNode(key);

    this.nodes.set(key, node);

    return node;
  }

  addMethod(method: Method, handler: HttpHandler) {
    this.methods.set(method, { method, handler });
  }

  findMethod(method: Method) {
    const result = this.methods.entries().find(([key]) => key.toUpperCase() === method.toUpperCase());

    if (!result) return undefined;

    return result[1];
  }

  print(previousSegments: Array<string> = []) {
    const segments = [...previousSegments, this.key];
    let path = segments.join('/');

    if (path === '') {
      path = '/';
    }

    this.methods.entries().forEach(([_key, value]) => console.log(`${value.method.padEnd(5)} ${path}`));

    this.nodes.forEach((node) => node.print(segments));
  }
}

export class SocketTrieNode {
  key: string;
  nodes: Map<string, SocketTrieNode> = new Map();
  isDynamic = false;
  handlers: Array<SocketHandler> = [];

  constructor(key: string, handler?: SocketHandler) {
    this.key = key;

    if (handler) {
      this.handlers.push(handler);
    }

    if (key.startsWith(':')) {
      this.isDynamic = true;
    }
  }

  addNode(key: string): SocketTrieNode {
    if (this.nodes.has(key)) {
      return this.nodes.get(key)!;
    }

    const node = new SocketTrieNode(key);

    this.nodes.set(key, node);

    return node;
  }

  addHandler(handler: SocketHandler) {
    this.handlers.push(handler);
  }
}
