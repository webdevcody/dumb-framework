import * as elements from "typed-html";

export function withTailwind(html: string) {
  const tailwindCssScript = <script src="https://cdn.tailwindcss.com"></script>;
  const tailwindConfig = (
    <script>
      {`
tailwind.config = {
  theme: {
    extend: {
      colors: {
        clifford: '#da373d',
      }
    }
  }
}
`}
    </script>
  );
  const tailwindUtilities = (
    <style type="text/tailwindcss">
      {`
  @layer utilities {
    .content-auto {
      content-visibility: auto;
    }
  }
`}
    </style>
  );
  return html.replace(
    "</head>",
    `${tailwindCssScript}${tailwindConfig}${tailwindUtilities}</head>`
  );
}
