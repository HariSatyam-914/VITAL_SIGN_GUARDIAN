# VitalSign Guardian

VitalSign Guardian is an AI-powered smart health monitoring and alert system designed to help users track their vital signs, predict potential health risks, and receive personalized health recommendations.

## Project Structure

- `frontend/`: React application with Tailwind CSS and Framer Motion
- `backend/`: FastAPI backend with ML models for health analysis

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Run the backend server:
   ```
   uvicorn main:app --reload
   ```

The backend API will be available at http://localhost:8000.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend application will be available at http://localhost:3000.

## API Keys

The application requires the following API keys:

1. **Frontend Environment Variables**:
   - `REACT_APP_API_URL`: URL for the backend API (defaults to 'http://localhost:8000/api')

2. **Backend Environment Variables**:
   - `SENDGRID_API_KEY`: Required for email functionality (uses a mock key for development)
   - `DATABASE_URL`: Database connection string
   - `SECRET_KEY`: Secret key for JWT token generation
   - `ALGORITHM`: Algorithm for JWT token generation
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes

## Features

- Multi-role user authentication (patients, doctors, admins)
- Dashboard with health overview
- Manual vitals input
- PDF report upload & processing
- Face scan vitals detection
- Disease risk detection
- Weekly/monthly/quarterly reports
- Email notifications
- Interactive health trend charts

## Technology Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, SQLAlchemy, Celery
- **AI/ML**: Random Forest, LSTM, OpenCV, MediaPipe
- **Email**: SendGrid/Resend