from datetime import datetime, timedelta
import json
import os
from typing import Dict, List, Optional, Any, Union

from fastapi import BackgroundTasks
from pydantic import BaseModel

# These would be imported from your actual models
class User(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    preferences: Dict[str, bool] = {
        "weeklyReport": True,
        "monthlyReport": True,
        "quarterlyReport": True,
        "alertEmails": True,
        "recommendationEmails": False,
        "reminderEmails": True
    }

class VitalSign(BaseModel):
    user_id: str
    type: str  # heart_rate, blood_pressure, respiratory_rate, stress, etc.
    value: Union[float, Dict[str, float]]  # Single value or dict for BP (systolic/diastolic)
    timestamp: datetime
    source: str  # manual, scan, pdf, device

class HealthRisk(BaseModel):
    user_id: str
    risk_type: str
    risk_score: float
    confidence: float
    timestamp: datetime
    recommendations: List[str]

class Report(BaseModel):
    id: str
    user_id: str
    title: str
    date: datetime
    type: str  # weekly, monthly, quarterly
    highlights: Optional[List[str]] = None
    recommendations: Optional[List[str]] = None
    status: str  # scheduled, generated
    html_content: Optional[str] = None
    pdf_path: Optional[str] = None

class ReportGenerator:
    """Service for generating health reports based on user data"""
    
    def __init__(self, db_service=None, email_service=None):
        self.db = db_service
        self.email_service = email_service
        self.report_templates = {
            "weekly": "weekly_report_template.html",
            "monthly": "monthly_report_template.html", 
            "quarterly": "quarterly_report_template.html"
        }
    
    async def schedule_reports(self, background_tasks: BackgroundTasks):
        """Schedule reports for all users based on their preferences"""
        # In a real implementation, this would fetch users from the database
        # users = await self.db.get_all_users()
        
        # Mock users for development
        users = [
            User(id="user1", email="user1@example.com", first_name="John", last_name="Doe"),
            User(id="user2", email="user2@example.com", first_name="Jane", last_name="Smith", 
                 preferences={"weeklyReport": True, "monthlyReport": False, "quarterlyReport": True,
                             "alertEmails": False, "recommendationEmails": True, "reminderEmails": False})
        ]
        
        today = datetime.now().date()
        
        for user in users:
            # Schedule weekly reports (every Wednesday)
            if user.preferences.get("weeklyReport", True) and today.weekday() == 2:  # Wednesday
                report_id = f"report-weekly-{user.id}-{today.isoformat()}"
                report = Report(
                    id=report_id,
                    user_id=user.id,
                    title="Weekly Health Summary",
                    date=datetime.now(),
                    type="weekly",
                    status="scheduled"
                )
                # In a real implementation, save to database
                # await self.db.save_report(report)
                
                # Schedule the report generation
                background_tasks.add_task(self.generate_report, report.id)
            
            # Schedule monthly reports (1st of month)
            if user.preferences.get("monthlyReport", True) and today.day == 1:
                report_id = f"report-monthly-{user.id}-{today.isoformat()}"
                report = Report(
                    id=report_id,
                    user_id=user.id,
                    title="Monthly Health Analysis",
                    date=datetime.now(),
                    type="monthly",
                    status="scheduled"
                )
                # await self.db.save_report(report)
                background_tasks.add_task(self.generate_report, report.id)
            
            # Schedule quarterly reports (1st of Jan, Apr, Jul, Oct)
            if (user.preferences.get("quarterlyReport", True) and 
                today.day == 1 and today.month in [1, 4, 7, 10]):
                report_id = f"report-quarterly-{user.id}-{today.isoformat()}"
                report = Report(
                    id=report_id,
                    user_id=user.id,
                    title="Quarterly Health Review",
                    date=datetime.now(),
                    type="quarterly",
                    status="scheduled"
                )
                # await self.db.save_report(report)
                background_tasks.add_task(self.generate_report, report.id)
    
    async def generate_report(self, report_id: str):
        """Generate a health report based on user data"""
        # In a real implementation, fetch the report from the database
        # report = await self.db.get_report(report_id)
        # user = await self.db.get_user(report.user_id)
        
        # Mock data for development
        report_type = report_id.split("-")[1]
        user_id = report_id.split("-")[2]
        
        # Get user data for the report period
        period_data = await self._get_user_data_for_period(user_id, report_type)
        
        # Generate highlights and recommendations
        highlights = self._generate_highlights(period_data)
        recommendations = self._generate_recommendations(period_data)
        
        # Generate HTML content
        html_content = await self._generate_html_report(
            user_id, report_type, period_data, highlights, recommendations
        )
        
        # Generate PDF
        pdf_path = await self._generate_pdf(html_content, report_id)
        
        # Update report
        report = Report(
            id=report_id,
            user_id=user_id,
            title=f"{report_type.capitalize()} Health Report",
            date=datetime.now(),
            type=report_type,
            highlights=highlights,
            recommendations=recommendations,
            status="generated",
            html_content=html_content,
            pdf_path=pdf_path
        )
        
        # Save updated report
        # await self.db.update_report(report)
        
        # Send email if user has email preferences enabled
        # user = await self.db.get_user(user_id)
        # if user.preferences.get(f"{report_type}Report", True):
        #     await self.email_service.send_report_email(user.email, report)
    
    async def _get_user_data_for_period(self, user_id: str, period: str) -> Dict[str, Any]:
        """Get user health data for the specified period"""
        # In a real implementation, fetch from database
        # Calculate date range based on period
        end_date = datetime.now()
        if period == "weekly":
            start_date = end_date - timedelta(days=7)
        elif period == "monthly":
            start_date = end_date - timedelta(days=30)
        elif period == "quarterly":
            start_date = end_date - timedelta(days=90)
        else:
            start_date = end_date - timedelta(days=7)  # Default to weekly
        
        # vital_signs = await self.db.get_vital_signs(user_id, start_date, end_date)
        # health_risks = await self.db.get_health_risks(user_id, start_date, end_date)
        
        # Mock data for development
        return {
            "vital_signs": {
                "heart_rate": [72, 75, 71, 74, 73, 70, 72],
                "blood_pressure": {
                    "systolic": [125, 128, 124, 130, 126, 122, 125],
                    "diastolic": [82, 84, 80, 86, 83, 81, 82]
                },
                "respiratory_rate": [16, 15, 16, 17, 16, 15, 16],
                "stress": [45, 60, 40, 55, 35, 30, 42]
            },
            "health_risks": {
                "heart_disease": 0.15,
                "hypertension": 0.25,
                "stress_related": 0.35
            },
            "trends": {
                "heart_rate": "stable",
                "blood_pressure": "slightly_elevated",
                "respiratory_rate": "normal",
                "stress": "improving"
            },
            "health_score": 78,
            "previous_health_score": 72
        }
    
    def _generate_highlights(self, period_data: Dict[str, Any]) -> List[str]:
        """Generate highlights based on the user's health data"""
        highlights = []
        
        # Heart rate analysis
        if period_data["trends"]["heart_rate"] == "stable":
            highlights.append("Heart rate has remained stable within normal range")
        elif period_data["trends"]["heart_rate"] == "improving":
            highlights.append("Heart rate has shown improvement")
        elif period_data["trends"]["heart_rate"] == "concerning":
            highlights.append("Heart rate shows some concerning patterns")
        
        # Blood pressure analysis
        if period_data["trends"]["blood_pressure"] == "normal":
            highlights.append("Blood pressure is within healthy range")
        elif period_data["trends"]["blood_pressure"] == "slightly_elevated":
            highlights.append("Blood pressure is slightly elevated")
        elif period_data["trends"]["blood_pressure"] == "elevated":
            highlights.append("Blood pressure is elevated and requires attention")
        
        # Respiratory rate
        if period_data["trends"]["respiratory_rate"] == "normal":
            highlights.append("Respiratory rate is within optimal range")
        
        # Stress level
        if period_data["trends"]["stress"] == "improving":
            highlights.append("Stress levels have decreased compared to previous period")
        elif period_data["trends"]["stress"] == "elevated":
            highlights.append("Stress levels are elevated")
        
        # Health score
        if period_data["health_score"] > period_data["previous_health_score"]:
            improvement = period_data["health_score"] - period_data["previous_health_score"]
            highlights.append(f"Overall health score improved by {improvement}%")
        
        return highlights
    
    def _generate_recommendations(self, period_data: Dict[str, Any]) -> List[str]:
        """Generate personalized recommendations based on health data"""
        recommendations = []
        
        # Blood pressure recommendations
        if period_data["trends"]["blood_pressure"] == "slightly_elevated":
            recommendations.append("Consider reducing sodium intake to help manage blood pressure")
            recommendations.append("Maintain regular cardiovascular exercise")
        elif period_data["trends"]["blood_pressure"] == "elevated":
            recommendations.append("Consult with your healthcare provider about your blood pressure")
            recommendations.append("Monitor your blood pressure regularly")
        
        # Stress recommendations
        if period_data["trends"]["stress"] == "elevated":
            recommendations.append("Consider incorporating stress management techniques like meditation")
            recommendations.append("Ensure you're getting adequate sleep")
        elif period_data["trends"]["stress"] == "improving":
            recommendations.append("Continue with your current stress management techniques")
        
        # General recommendations
        if period_data["health_score"] < 70:
            recommendations.append("Schedule a check-up with your primary care physician")
        
        if len(recommendations) == 0:
            recommendations.append("Maintain your current health routine")
            recommendations.append("Stay hydrated and continue regular physical activity")
        
        return recommendations
    
    async def _generate_html_report(
        self, 
        user_id: str, 
        report_type: str, 
        period_data: Dict[str, Any],
        highlights: List[str],
        recommendations: List[str]
    ) -> str:
        """Generate HTML report content"""
        # In a real implementation, use a template engine like Jinja2
        # template_path = os.path.join("templates", self.report_templates[report_type])
        # with open(template_path, "r") as f:
        #     template = f.read()
        
        # Replace placeholders with actual data
        # html_content = template.replace("{{user_name}}", user.first_name)
        # ...
        
        # Mock HTML content for development
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>{report_type.capitalize()} Health Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 800px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; margin-bottom: 30px; }}
                .section {{ margin-bottom: 30px; }}
                .highlight {{ background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 10px; }}
                .recommendation {{ background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin-bottom: 10px; }}
                .chart {{ background-color: #eee; height: 300px; margin: 20px 0; border-radius: 5px; display: flex; align-items: center; justify-content: center; }}
                .footer {{ text-align: center; margin-top: 50px; font-size: 0.8em; color: #777; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>{report_type.capitalize()} Health Report</h1>
                    <p>Generated on {datetime.now().strftime('%B %d, %Y')}</p>
                </div>
                
                <div class="section">
                    <h2>Health Score</h2>
                    <p>Your current health score is <strong>{period_data['health_score']}</strong>, which is 
                    {period_data['health_score'] - period_data['previous_health_score']} points 
                    {'higher' if period_data['health_score'] > period_data['previous_health_score'] else 'lower'} 
                    than your previous score.</p>
                    <div class="chart">[Health Score Chart Visualization]</div>
                </div>
                
                <div class="section">
                    <h2>Highlights</h2>
                    {''.join([f'<div class="highlight">• {highlight}</div>' for highlight in highlights])}
                </div>
                
                <div class="section">
                    <h2>Vital Signs Summary</h2>
                    <div class="chart">[Vital Signs Chart]</div>
                    <p>Your heart rate has averaged {sum(period_data['vital_signs']['heart_rate']) / len(period_data['vital_signs']['heart_rate']):.1f} bpm.</p>
                    <p>Your blood pressure has averaged {sum(period_data['vital_signs']['blood_pressure']['systolic']) / len(period_data['vital_signs']['blood_pressure']['systolic']):.1f}/{sum(period_data['vital_signs']['blood_pressure']['diastolic']) / len(period_data['vital_signs']['blood_pressure']['diastolic']):.1f} mmHg.</p>
                </div>
                
                <div class="section">
                    <h2>Health Risk Assessment</h2>
                    <div class="chart">[Risk Assessment Chart]</div>
                    <p>Based on your vital signs and health data, we've assessed the following risk factors:</p>
                    <ul>
                        {''.join([f'<li><strong>{risk.replace("_", " ").title()}</strong>: {score*100:.1f}% risk</li>' for risk, score in period_data['health_risks'].items()])}
                    </ul>
                </div>
                
                <div class="section">
                    <h2>Recommendations</h2>
                    {''.join([f'<div class="recommendation">• {recommendation}</div>' for recommendation in recommendations])}
                </div>
                
                <div class="footer">
                    <p>This report is generated based on your health data and is intended for informational purposes only.</p>
                    <p>It is not a substitute for professional medical advice. Please consult with your healthcare provider for medical advice.</p>
                    <p>© {datetime.now().year} VitalSign Guardian</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return html_content
    
    async def _generate_pdf(self, html_content: str, report_id: str) -> str:
        """Generate PDF from HTML content"""
        # In a real implementation, use a library like WeasyPrint or wkhtmltopdf
        # pdf_path = f"reports/{report_id}.pdf"
        # html_to_pdf(html_content, pdf_path)
        
        # Mock implementation
        pdf_path = f"/tmp/reports/{report_id}.pdf"
        return pdf_path
    
    async def generate_report_on_demand(self, user_id: str, report_type: str) -> Report:
        """Generate a report on demand"""
        report_id = f"report-{report_type}-{user_id}-{datetime.now().isoformat()}"
        
        # Generate the report
        await self.generate_report(report_id)
        
        # In a real implementation, fetch the generated report
        # report = await self.db.get_report(report_id)
        
        # Mock report for development
        report = Report(
            id=report_id,
            user_id=user_id,
            title=f"{report_type.capitalize()} Health Report",
            date=datetime.now(),
            type=report_type,
            highlights=[
                "Heart rate has remained stable within normal range",
                "Blood pressure is slightly elevated",
                "Stress levels have decreased compared to previous period"
            ],
            recommendations=[
                "Consider reducing sodium intake to help manage blood pressure",
                "Continue with your current stress management techniques"
            ],
            status="generated",
            html_content="<html>...</html>",
            pdf_path=f"/tmp/reports/{report_id}.pdf"
        )
        
        return report