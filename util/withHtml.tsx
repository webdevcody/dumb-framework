import * as elements from "typed-html";

export function withHtml(body: string) {
  return (
    <html>
      <head>
        <title>Hello World</title>
      </head>

      <body>{body}</body>
    </html>
  );
}
