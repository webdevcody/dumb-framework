import * as elements from "typed-html";

export function withLiveReload(html: string) {
  if (process.env.NODE_ENV !== "development") return html;

  const liveReloadScript = (
    <script>{`
  function connectWebSocket() {
    let socket = new WebSocket("ws://localhost:4001/ws");

    socket.onopen = function(e) {
      // WebSocket connection is open
    };

    socket.onmessage = function(event) {
      location.reload();
    };

    socket.onclose = function(event) {
    };

    socket.onerror = function(error) {
      console.log("WebSocket error:", error);
    };
  }

  connectWebSocket(); // Initial connection
`}</script>
  );
  return html.replace("</head>", `${liveReloadScript}</head>`);
}
