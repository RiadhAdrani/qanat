import { resolveSegments } from '../helpers/mod.ts';
import type { Method, RouteHandler, RouteParameters } from '../types/mod.ts';

export type FindTrieResult = {
  trie: TrieNode;
  method: Method;
  handler: RouteHandler;
  params: RouteParameters;
};

export class Trie {
  root: TrieNode = new TrieNode('');

  constructor() {}

  add(method: Method, segments: Array<string>, hanlder: RouteHandler): void {
    if (segments.length === 1) {
      this.root.addMethod(method, hanlder);
      return;
    }

    let currentNode = this.root;

    for (let i = 1; i < segments.length; i++) {
      let next = currentNode?.nodes.get(segments[i]);
      if (!next) {
        next = new TrieNode(segments[i]);
        currentNode?.nodes.set(segments[i], next);
      }

      currentNode = next;

      if (i === segments.length - 1) {
        currentNode?.addMethod(method, hanlder);
      }
    }
  }

  find(method: Method, path: string): FindTrieResult | undefined {
    const segments = resolveSegments(path);

    let node: TrieNode | undefined;

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

export class TrieNode {
  key: string;
  nodes: Map<string, TrieNode> = new Map();
  methods: Map<Method, { method: Method; handler: RouteHandler }> = new Map();
  isDynamic = false;

  constructor(key: string) {
    this.key = key;

    if (key.startsWith(':')) {
      this.isDynamic = true;
    }
  }

  addNode(key: string): TrieNode {
    if (this.nodes.has(key)) {
      return this.nodes.get(key)!;
    }

    const node = new TrieNode(key);

    this.nodes.set(key, node);

    return node;
  }

  addMethod(method: Method, handler: RouteHandler) {
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
