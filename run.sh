#!/bin/bash

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    handle_error "Python 3 is not installed. Please install Python 3 and try again."
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    handle_error "Node.js is not installed. Please install Node.js and try again."
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    handle_error "npm is not installed. Please install npm and try again."
fi

# Make the script executable
chmod +x "$0"

# Setup and run backend
setup_backend() {
    echo "Setting up backend..."
    cd backend || handle_error "Backend directory not found"
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv || handle_error "Failed to create virtual environment"
    fi
    
    # Activate virtual environment
    echo "Activating virtual environment..."
    source venv/bin/activate || handle_error "Failed to activate virtual environment"
    
    # Install dependencies
    echo "Installing backend dependencies..."
    pip install -r requirements.txt || handle_error "Failed to install backend dependencies"
    
    # Run backend server
    echo "Starting backend server..."
    uvicorn main:app --reload &
    
    # Store backend PID
    BACKEND_PID=$!
    echo "Backend server started with PID: $BACKEND_PID"
    
    # Return to root directory
    cd ..
}

# Setup and run frontend
setup_frontend() {
    echo "Setting up frontend..."
    cd frontend || handle_error "Frontend directory not found"
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install || handle_error "Failed to install frontend dependencies"
    fi
    
    # Run frontend server
    echo "Starting frontend server..."
    npm start &
    
    # Store frontend PID
    FRONTEND_PID=$!
    echo "Frontend server started with PID: $FRONTEND_PID"
    
    # Return to root directory
    cd ..
}

# Cleanup function to kill processes on exit
cleanup() {
    echo "Shutting down servers..."
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID
        echo "Backend server stopped"
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID
        echo "Frontend server stopped"
    fi
    exit 0
}

# Set up trap to call cleanup function on script exit
trap cleanup EXIT INT TERM

# Main execution
echo "Starting VitalSign Guardian application..."

# Setup and run backend
setup_backend

# Setup and run frontend
setup_frontend

echo "VitalSign Guardian is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop the servers"

# Keep the script running
while true; do
    sleep 1
done