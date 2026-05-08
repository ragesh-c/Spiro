#!/usr/bin/env python3
import http.server
import os

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path in ('/work', '/work/'):
            self.send_response(301)
            self.send_header('Location', '/work.html')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        print(f"{self.address_string()} - {format % args}")

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = http.server.HTTPServer(('', 3000), Handler)
    print('Server running at http://localhost:3000')
    server.serve_forever()
