"""Local dev server with clean URLs (/shop -> shop.html, /admin/ -> admin/index.html), like GitHub Pages.
Run:  python serve.py   then open http://localhost:8765/"""
import http.server, os, socketserver

class H(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        if not os.path.exists(p) and not os.path.splitext(p)[1] and os.path.exists(p + '.html'):
            return p + '.html'
        return p
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', 8765), H) as s:
    print('Serving on http://localhost:8765/  (admin: http://localhost:8765/admin/)')
    s.serve_forever()
