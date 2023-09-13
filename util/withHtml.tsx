import * as elements from "typed-html";

export function withHtml(body: string) {
  return (
    <html>
      <head>
        <title>Hello World</title>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/classnames/2.3.2/index.min.js"
          integrity="sha512-GqhSAi+WYQlHmNWiE4TQsVa7HVKctQMdgUMA+1RogjxOPdv9Kj59/no5BEvJgpvuMTYw2JRQu/szumfVXdowag=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        ></script>
      </head>

      <body>{body}</body>
    </html>
  );
}
