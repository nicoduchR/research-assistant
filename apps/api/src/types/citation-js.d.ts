declare module 'citation-js' {
  class Cite {
    constructor(data?: any);
    format(type: string, options?: any): string;
  }
  export = Cite;
}

declare module '@citation-js/core' {
  export const plugins: {
    config: {
      get(plugin: string): {
        templates: {
          add(name: string, template: string): void;
        };
      };
    };
  };
}
