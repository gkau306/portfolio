"""Local dev server for the portfolio: static files, no caching.

    python3 .claude/devserver.py        # http://localhost:4321

No-store headers so edits to js/*.js show up on a plain reload — browsers
otherwise hang on to ES modules.
"""
import functools, http.server, socketserver, os

DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("PORT", 4321))


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    handler = functools.partial(Handler, directory=DIR)
    print(f"serving {DIR} at http://localhost:{PORT}")
    socketserver.TCPServer(("127.0.0.1", PORT), handler).serve_forever()
