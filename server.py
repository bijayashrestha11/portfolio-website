#!/usr/bin/env python3
"""
Portfolio Server
A simple Python HTTP server to serve the portfolio website.

Usage:
    python server.py [port]

Default port is 8000.
Visit http://localhost:8000 in your browser.
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path


class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler with better defaults."""

    def __init__(self, *args, **kwargs):
        # Set the directory to serve files from
        super().__init__(*args, directory=str(Path(__file__).parent), **kwargs)

    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom log format with colors
        message = format % args
        if '200' in message or '304' in message:
            status_color = '\033[92m'  # Green
        elif '404' in message:
            status_color = '\033[91m'  # Red
        else:
            status_color = '\033[93m'  # Yellow

        reset = '\033[0m'
        print(f"{status_color}[{self.log_date_time_string()}]{reset} {message}")


def run_server(port: int = 8000, open_browser: bool = True):
    """
    Start the portfolio server.

    Args:
        port: Port number to serve on (default: 8000)
        open_browser: Whether to open the browser automatically
    """
    handler = PortfolioHandler

    with socketserver.TCPServer(("", port), handler) as httpd:
        url = f"http://localhost:{port}"

        print("\n" + "=" * 50)
        print("  Data Engineer Portfolio Server")
        print("=" * 50)
        print(f"\n  Server running at: \033[94m{url}\033[0m")
        print(f"  Press Ctrl+C to stop\n")
        print("=" * 50 + "\n")

        if open_browser:
            try:
                webbrowser.open(url)
            except Exception:
                pass  # Browser opening failed, continue anyway

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n  Server stopped. Goodbye!")
            sys.exit(0)


def main():
    """Main entry point."""
    # Parse command line arguments
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Error: Invalid port number '{sys.argv[1]}'")
            print("Usage: python server.py [port]")
            sys.exit(1)

    # Check if port is available
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()

    if result == 0:
        print(f"Error: Port {port} is already in use.")
        print(f"Try: python server.py {port + 1}")
        sys.exit(1)

    run_server(port)


if __name__ == "__main__":
    main()
