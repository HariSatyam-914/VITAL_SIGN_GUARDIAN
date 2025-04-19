from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from typing import List, Optional
from datetime import datetime, timedelta

from ..services.report_generator import ReportGenerator, Report
from ..services.email_service import EmailService

router = APIRouter()

# Dependency injection (in a real app, these would be properly initialized)
def get_report_generator():
    return ReportGenerator()

def get_email_service():
    return EmailService()

@router.get("/reports", response_model=List[Report])
async def get_user_reports(
    user_id: str,
    report_type: Optional[str] = None,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    report_generator: ReportGenerator = Depends(get_report_generator)
):
    """Get reports for a user"""
    # In a real implementation, fetch from database
    # reports = await report_generator.db.get_user_reports(user_id, report_type, limit, offset)
    
    # Mock data for development
    reports = [
        Report(
            id=f"report-weekly-{user_id}-2023-11-15",
            user_id=user_id,
            title="Weekly Health Summary",
            date=datetime.fromisoformat("2023-11-15"),
            type="weekly",
            highlights=[
                "Heart rate stable within normal range",
                "Blood pressure slightly elevated",
                "Stress levels decreased by 15%"
            ],
            recommendations=[
                "Continue regular exercise routine",
                "Monitor sodium intake to address blood pressure"
            ],
            status="generated"
        ),
        Report(
            id=f"report-monthly-{user_id}-2023-11-01",
            user_id=user_id,
            title="Monthly Health Analysis",
            date=datetime.fromisoformat("2023-11-01"),
            type="monthly",
            highlights=[
                "Overall health score improved by 8%",
                "Sleep quality shows positive trend",
                "Respiratory rate normalized"
            ],
            recommendations=[
                "Maintain current sleep schedule",
                "Consider adding meditation to daily routine"
            ],
            status="generated"
        ),
        Report(
            id=f"report-quarterly-{user_id}-2023-10-01",
            user_id=user_id,
            title="Quarterly Health Review",
            date=datetime.fromisoformat("2023-10-01"),
            type="quarterly",
            highlights=[
                "Significant improvement in cardiovascular health",
                "Stress management techniques showing positive results",
                "Weight stabilized within healthy range"
            ],
            recommendations=[
                "Schedule follow-up with primary care physician",
                "Continue current health management plan"
            ],
            status="generated"
        ),
        Report(
            id=f"report-weekly-{user_id}-2023-11-22",
            user_id=user_id,
            title="Weekly Health Summary",
            date=datetime.fromisoformat("2023-11-22"),
            type="weekly",
            status="scheduled"
        )
    ]
    
    # Filter by report type if specified
    if report_type:
        reports = [r for r in reports if r.type == report_type]
    
    # Apply pagination
    reports = reports[offset:offset+limit]
    
    return reports

@router.get("/reports/{report_id}", response_model=Report)
async def get_report(
    report_id: str,
    report_generator: ReportGenerator = Depends(get_report_generator)
):
    """Get a specific report by ID"""
    # In a real implementation, fetch from database
    # report = await report_generator.db.get_report(report_id)
    # if not report:
    #     raise HTTPException(status_code=404, detail="Report not found")
    
    # Mock data for development
    user_id = "user123"  # This would be extracted from the report_id in a real implementation
    report = Report(
        id=report_id,
        user_id=user_id,
        title="Weekly Health Summary",
        date=datetime.now() - timedelta(days=2),
        type="weekly",
        highlights=[
            "Heart rate stable within normal range",
            "Blood pressure slightly elevated",
            "Stress levels decreased by 15%"
        ],
        recommendations=[
            "Continue regular exercise routine",
            "Monitor sodium intake to address blood pressure"
        ],
        status="generated"
    )
    
    return report

@router.post("/reports/generate", response_model=Report)
async def generate_report(
    user_id: str,
    report_type: str,
    background_tasks: BackgroundTasks,
    report_generator: ReportGenerator = Depends(get_report_generator)
):
    """Generate a report on demand"""
    # Validate report type
    if report_type not in ["weekly", "monthly", "quarterly"]:
        raise HTTPException(status_code=400, detail="Invalid report type")
    
    # Create a scheduled report
    report_id = f"report-{report_type}-{user_id}-{datetime.now().isoformat()}"
    report = Report(
        id=report_id,
        user_id=user_id,
        title=f"{report_type.capitalize()} Health Report",
        date=datetime.now(),
        type=report_type,
        status="scheduled"
    )
    
    # In a real implementation, save to database
    # await report_generator.db.save_report(report)
    
    # Schedule the report generation
    background_tasks.add_task(report_generator.generate_report, report_id)
    
    return report

@router.post("/reports/schedule")
async def schedule_reports(
    background_tasks: BackgroundTasks,
    report_generator: ReportGenerator = Depends(get_report_generator)
):
    """Schedule reports for all users based on their preferences"""
    await report_generator.schedule_reports(background_tasks)
    return {"status": "Reports scheduled successfully"}

@router.post("/email/test")
async def send_test_email(
    email: str,
    email_type: str,
    email_service: EmailService = Depends(get_email_service)
):
    """Send a test email"""
    if email_type == "report":
        # Create a mock report
        report = Report(
            id="test-report-123",
            user_id="test-user",
            title="Test Weekly Health Report",
            date=datetime.now(),
            type="weekly",
            highlights=[
                "This is a test highlight 1",
                "This is a test highlight 2",
                "This is a test highlight 3"
            ],
            recommendations=[
                "This is a test recommendation 1",
                "This is a test recommendation 2"
            ],
            status="generated"
        )
        await email_service.send_report_email(email, report)
    
    elif email_type == "alert":
        alert_data = {
            "message": "Your blood pressure readings have been consistently elevated over the past week.",
            "recommendations": [
                "Monitor your blood pressure daily",
                "Reduce sodium intake",
                "Consider consulting with your healthcare provider"
            ]
        }
        await email_service.send_health_alert(email, alert_data)
    
    elif email_type == "recommendation":
        recommendations = [
            "Based on your recent activity, consider increasing your daily water intake",
            "Your sleep patterns suggest you might benefit from a more consistent sleep schedule",
            "Consider adding more cardiovascular exercise to your routine"
        ]
        await email_service.send_recommendation_email(email, recommendations)
    
    elif email_type == "reminder":
        await email_service.send_reminder_email(email)
    
    else:
        raise HTTPException(status_code=400, detail="Invalid email type")
    
    return {"status": "Test email sent successfully"}