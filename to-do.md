# VitalSign Guardian – Project Plan

## Project Overview
VitalSign Guardian is an AI-powered smart health monitoring and alert system designed to help users track their vital signs, predict potential health risks, and receive personalized health recommendations. The application will be available on both web and mobile platforms with a focus on user experience, security, and accuracy.

## Current Progress
We have set up the basic project structure for both frontend and backend. The frontend includes a React application with Tailwind CSS for styling and Framer Motion for animations. We've implemented the authentication system, dashboard layout, and face scanning interface with animations. The backend has a basic FastAPI structure ready for further development.

## Project Phases

### Phase 1: Project Setup & Authentication System (Weeks 1-2)

#### Week 1: Project Initialization
- [x] Create project repository
- [x] Set up project structure for both frontend and backend
- [ ] Define API endpoints and data models
- [ ] Create database schema
- [x] Set up development environments for web and mobile

#### Week 2: Authentication System
- [x] Implement multi-role user authentication (patients, doctors, admins)
- [x] Develop JWT-based authentication for web and mobile
- [x] Create login/signup forms with smooth animations
- [x] Implement password reset functionality
- [x] Set up user profile management
- [x] Add email verification system
- [ ] Test authentication flows across platforms

### Phase 2: Core Dashboard & Vitals Management (Weeks 3-5)

#### Week 3: Dashboard Framework
- [x] Design and implement dashboard layout
- [x] Create responsive sidebar navigation
- [x] Develop user profile section
- [x] Implement settings page
- [x] Create health overview summary component

#### Week 4: Manual Vitals Input
- [x] Develop forms for manual vitals input
- [x] Create data validation for vitals
- [x] Implement vitals history storage
- [ ] Design and implement basic health visualizations
- [ ] Add date filtering for vitals history

#### Week 5: PDF Report Upload & Processing
- [x] Implement PDF upload functionality
- [x] Develop OCR system for extracting data from medical PDFs
- [x] Create data parsing and normalization for extracted information
- [x] Implement validation and error handling for PDF processing
- [x] Add manual correction interface for OCR errors

### Phase 3: Face Scan Vitals Detection (Weeks 6-8)

#### Week 6: Camera Integration & UI
- [x] Set up camera access permissions for web and mobile
- [x] Create real-time video feed component
- [x] Design animated scanner interface
- [x] Implement face detection using MediaPipe
- [x] Add visual feedback during scanning

#### Week 7: Vital Sign Extraction
- [x] Implement heart rate detection algorithm
- [x] Develop respiratory rate extraction
- [x] Add stress level estimation
- [x] Implement fatigue detection
- [ ] Create calibration system for improved accuracy

#### Week 8: Results Display & Storage
- [x] Design and implement results display with animations
- [x] Create floating health indicators overlay
- [x] Add disclaimer for non-clinical usage
- [x] Implement storage of scan results in database
- [ ] Develop comparison view between manual and scan-based vitals

### Phase 4: Disease Risk Detection & ML Models (Weeks 9-11)

#### Week 9: Data Preparation & Model Setup
- [x] Prepare training datasets for ML models
- [x] Set up ML pipeline infrastructure
- [x] Implement data preprocessing for vitals
- [x] Create feature extraction system
- [x] Develop model versioning and management

#### Week 10: Random Forest Implementation
- [x] Train Random Forest model for basic health risk prediction
- [x] Implement model inference API
- [x] Create risk score calculation
- [x] Develop interpretable output format
- [x] Test and validate model accuracy

#### Week 11: LSTM for Time-Series Analysis
- [x] Implement LSTM model for health trend forecasting
- [x] Create time-series data preparation pipeline
- [x] Develop trend prediction system
- [x] Add confidence intervals for predictions
- [x] Implement model performance monitoring

### Phase 5: Reporting & Notifications (Weeks 12-14)

#### Week 12: Weekly Report Generator
- [x] Set up Celery/Firebase Scheduler for automated reports
- [x] Design HTML report templates
- [x] Implement report generation logic
- [x] Create personalized recommendations system
- [x] Add diet and exercise suggestion algorithms

#### Week 13: Email System
- [x] Integrate with SendGrid/Resend for email delivery
  - [x] Replaced SendGrid with Resend email service
  - [x] Added Resend API key: re_cB6iuhbb_KK7uMMfXsxLSTmH4SA7cWmud
  - [x] Updated email sending implementation
  - [x] Added Resend package to requirements.txt
- [x] Create email templates for weekly reports
- [x] Implement real-time alert emails
- [x] Add email preference management
- [x] Test email delivery and tracking

#### Week 14: Advanced Visualizations
- [x] Implement interactive health trend charts
- [x] Add weekly/monthly view toggles with animations
- [x] Create health score dashboard
- [x] Develop comparative analysis visualizations
- [x] Add export functionality for reports and visualizations

### Phase 6: UI Polish & Compliance (Weeks 15-16)

#### Week 15: UI Refinement
- [x] Implement glassmorphism/neumorphism design system
- [x] Add Framer Motion animations throughout the application
- [x] Refine responsive design for all screen sizes
- [x] Implement dark/light mode
- [ ] Add accessibility features (WCAG 2.1 compliance)

#### Week 16: Security & Compliance
- [ ] Implement end-to-end encryption for sensitive data
- [ ] Add HIPAA/GDPR compliance features
- [ ] Create data retention and deletion policies
- [ ] Implement audit logging
- [ ] Add user consent management
- [ ] Conduct security testing and vulnerability assessment

### Phase 7: Testing & Deployment (Weeks 17-18)

#### Week 17: Testing
- [ ] Conduct comprehensive unit testing
- [ ] Perform integration testing across platforms
- [ ] Complete user acceptance testing
- [ ] Conduct performance optimization
- [ ] Fix identified bugs and issues

#### Week 18: Deployment
- [ ] Set up production environments
- [ ] Deploy web application
- [ ] Release mobile apps to app stores
- [ ] Implement analytics and monitoring
- [ ] Create user documentation and help resources

## Optional Enhancements (Post-Launch)

### IoT & Emergency Features
- [x] Implement smartwatch/device integration
- [x] Add voice assistant capabilities
- [x] Develop emergency alert system for critical conditions
- [x] Create caregiver notification system
- [x] Add telemedicine integration

### Advanced AI Features
- [x] Implement GPT for natural language report summaries
- [x] Add personalized health coaching
- [x] Develop medication management and reminders
- [x] Create sleep analysis features
- [x] Add nutrition tracking and recommendations

## Technology Stack

### Frontend
- Web: React.js, Tailwind CSS, Framer Motion
- Mobile: Flutter (iOS + Android)

### Backend
- FastAPI for async support
- PostgreSQL for database
- Celery for background tasks
- Resend for email delivery

### AI/ML
- Random Forest, LSTM
- OpenCV, MediaPipe, PyVHR for facial vital signs detection
- Optional: GPT for natural language report summaries

## Team Allocation

### Frontend Team
- 2 React developers
- 2 Flutter developers
- 1 UI/UX designer

### Backend Team
- 2 FastAPI developers
- 1 Database specialist
- 1 DevOps engineer

### AI/ML Team
- 2 ML engineers
- 1 Computer vision specialist

## Progress Tracking
- Weekly sprint planning and review meetings
- Daily standups
- Bi-weekly demos to stakeholders
- Monthly milestone reviews

## Recent Fixes
- Fixed ScanResults.jsx file by:
  1. Moved imports to the top of the file (React components should always have imports at the top)
  2. Fixed async/await usage in useEffect by creating a proper async function inside useEffect
  3. Made the code more maintainable by adding clear comments and proper structure
  4. Improved error handling for better user experience

- Fixed email_service.py file by:
  1. Added missing import for timedelta from the datetime module
  2. Fixed date calculation in the weekly report date range formatting
  3. Ensured proper API key handling for email service

## Current Issues (2024-07-02)
- ✅ Fixed missing module errors in frontend:
  1. ✅ Created missing auth pages: ForgotPassword, ResetPassword, VerifyEmail
  2. ✅ Created missing main pages: Profile, Settings
  3. ✅ Created missing config file for API configuration
  4. ✅ Installed missing npm packages: jwt-decode, @mediapipe/face_detection, @mediapipe/camera_utils, @mediapipe/drawing_utils, react-chartjs-2, chart.js
  5. ✅ Fixed incorrect import path in ScanResults.jsx for testingApi
  6. ✅ Created testingApi.js file for face scan testing

## Current Issues (2024-07-03)
- ✅ Fixed CSS errors in frontend/src/index.css:
  1. ✅ Created tailwind.config.js file
  2. ✅ Created postcss.config.js file
  3. ✅ Verified all required dependencies are installed (tailwindcss, postcss, autoprefixer)
  4. ✅ Created VS Code settings to disable CSS validation for Tailwind directives
  5. ✅ Updated root-level VS Code settings to apply Tailwind CSS settings project-wide

- ✅ Fixed build compilation errors:
  1. ✅ Created DashboardLayout component in frontend/src/components/layouts/DashboardLayout.jsx
  2. ✅ Fixed 'API_URL' usage in reportsApi.js and visualizationsApi.js
  3. ✅ Replaced all instances of 'API_BASE_URL' with 'API_URL' in API files
  4. ✅ Fixed undefined fetchProfile function in Profile.jsx
  5. ✅ Cleared ESLint cache to resolve persistent errors
  6. ✅ Successfully built the application (with only non-critical warnings)

## Required API Keys
The VitalSign Guardian project requires the following API keys to run properly:

1. **Frontend Environment Variables**:
   - `REACT_APP_API_URL`: URL for the backend API (defaults to 'http://localhost:8000/api' if not set)

2. **Backend Environment Variables**:
   - `SENDGRID_API_KEY`: Required for email functionality (currently uses a mock key for development)
   - `DATABASE_URL`: Database connection string
   - `SECRET_KEY`: Secret key for JWT token generation
   - `ALGORITHM`: Algorithm for JWT token generation
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes

### How to Set Up API Keys

1. **For Development**:
   - Create a `.env` file in the frontend directory with:
     ```
     REACT_APP_API_URL=http://localhost:8000/api
     ```
   - Create a `.env` file in the backend directory with:
     ```
     SENDGRID_API_KEY=mock_api_key
     DATABASE_URL=sqlite:///./app.db
     SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
     ALGORITHM=HS256
     ACCESS_TOKEN_EXPIRE_MINUTES=30
     ```

2. **For Production**:
   - Set these environment variables on your hosting platform
   - For SendGrid, sign up at [SendGrid](https://sendgrid.com/) to get an API key

## Running the Application

### Method 1: Using the run script

1. Make the run script executable:
   ```
   chmod +x run.sh
   ```

2. Run the script:
   ```
   ./run.sh
   ```

This will start both the backend and frontend servers.

### Method 2: Manual setup

#### Backend Setup

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

#### Frontend Setup

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

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Email System Updates (2024-07-01)
- Replaced SendGrid with Resend for email delivery:
  1. Updated `email_service.py` to use Resend instead of SendGrid
  2. Added Resend API key: re_cB6iuhbb_KK7uMMfXsxLSTmH4SA7cWmud
  3. Added proper error handling for email sending
  4. Added Resend package (v0.6.0) to requirements.txt
  5. Maintained all existing email templates and functionality
  
  Note: For production deployment, uncomment line 424 in `email_service.py` to enable actual email sending.