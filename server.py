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
    port = int(os.environ.get('PORT', 3000))
    while True:
        try:
            server = http.server.HTTPServer(('', port), Handler)
            print(f'Server running at http://localhost:{port}')
            server.serve_forever()
            break
        except OSError as e:
            if e.errno == 48: # Address already in use
                print(f'Port {port} is in use, trying {port + 1}...')
                port += 1
            else:
                raise e

