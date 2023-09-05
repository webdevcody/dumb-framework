export type HandlerContext = {
  html: (strings: TemplateStringsArray, ...interpolations: any[]) => string;
};
