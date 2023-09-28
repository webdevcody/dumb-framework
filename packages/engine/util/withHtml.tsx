import * as elements from "typed-html";

export function withHtml(body: string, styles: string[]) {
  return (
    <html>
      <head>
        <title>Hello World</title>
        {`${styles.map((style) => <link rel="stylesheet" href={style} />)}`}
      </head>

      {body}
    </html>
  );
}
