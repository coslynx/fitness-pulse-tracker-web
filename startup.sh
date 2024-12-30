#!/bin/bash
set -euo pipefail

PROJECT_ROOT=$(pwd)
LOG_FILE="$PROJECT_ROOT/server.log"
NPM_INSTALL_ERRORS_LOG="$PROJECT_ROOT/npm_install_errors.log"
BUILD_ERRORS_LOG="$PROJECT_ROOT/build_errors.log"

if [ ! -f "$PROJECT_ROOT/.env" ]; then
  echo "Error: .env file not found. Please configure environment variables."
  echo "Example .env file:"
  echo "MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
  echo "JWT_SECRET=your-secret-key-here"
  echo "PORT=5000"
  echo "ALLOWED_ORIGINS=http://localhost:3000"
  exit 1
fi

source "$PROJECT_ROOT/.env"

if [ -z "$MONGODB_URI" ] || [ -z "$JWT_SECRET" ] || [ -z "$PORT" ] || [ -z "$ALLOWED_ORIGINS" ]; then
  echo "Error: Required environment variables not set in .env file."
  echo "Please configure MONGODB_URI, JWT_SECRET, PORT, and ALLOWED_ORIGINS."
  exit 1
fi

npm install > /dev/null 2>"$NPM_INSTALL_ERRORS_LOG" || {
  echo "Error: npm install failed. See $NPM_INSTALL_ERRORS_LOG for details."
  exit 1
}

npm run build > /dev/null 2>"$BUILD_ERRORS_LOG" || {
    echo "Error: npm run build failed. See $BUILD_ERRORS_LOG for details."
    exit 1
}

node server.js >> "$LOG_FILE" 2>&1 &
SERVER_PID=$!

sleep 5

curl -s http://localhost:"$PORT"/api/ 

if [ $? -ne 0 ]; then
   echo "Error: Server health check failed."
  kill "$SERVER_PID"
  exit 1
fi

echo "Server is ready and running on port $PORT"

echo "Startup complete."
