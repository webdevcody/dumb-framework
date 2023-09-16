export function withScript(script: string) {
  return (html: string) => {
    const scriptWrapped = `
    <script type="module">${script}
    </script>
  `;
    return html.replace("</head>", `${scriptWrapped}</head>`);
  };
}
