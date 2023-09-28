export function withScript(scriptPath: string, extra: string) {
  return (html: string) => {
    const scriptWrapped = `
    <script>
      global = window;
      import("./${scriptPath}").then(dumb => {
        ${extra}
      });
    </script>
  `;
    return html.replace("</head>", `${scriptWrapped}</head>`);
  };
}
