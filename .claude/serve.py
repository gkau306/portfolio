import os, http.server, socketserver
os.chdir("/Users/gurleenkaur/Desktop/portfolio")
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", 4321), http.server.SimpleHTTPRequestHandler) as httpd:
    httpd.serve_forever()
