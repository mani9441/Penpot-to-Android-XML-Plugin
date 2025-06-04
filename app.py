import subprocess
import threading
import time
import sys

def run_flask():
    # Run server.py with python
    process = subprocess.Popen([sys.executable, 'server.py'])
    process.wait()

def run_npm():
    # Run `npm run dev` command
    process = subprocess.Popen(['npm', 'run', 'dev'])
    process.wait()

if __name__ == "__main__":
    # Run both in separate threads so they run concurrently
    flask_thread = threading.Thread(target=run_flask)
    npm_thread = threading.Thread(target=run_npm)

    flask_thread.start()
    npm_thread.start()

    flask_thread.join()
    npm_thread.join()
