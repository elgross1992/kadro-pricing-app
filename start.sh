#!/bin/bash

echo "🚀 Starting Kadro Pricing App..."
echo ""

# Check if in correct directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: Please run this script from the kadro-pricing-app directory"
    exit 1
fi

# Start backend in background
echo "📦 Starting backend server on http://localhost:3001..."
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "🎨 Starting frontend on http://localhost:3000..."
cd client
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ App is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Shutting down...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
