import os
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr

# Resend email library
import resend

class EmailTemplate(BaseModel):
    subject: str
    html_content: str
    text_content: str

class EmailService:
    """Service for sending emails to users"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("RESEND_API_KEY", "re_cB6iuhbb_KK7uMMfXsxLSTmH4SA7cWmud")
        # Initialize the Resend client
        resend.api_key = self.api_key
        
        # Load email templates
        self._load_templates()
    
    def _load_templates(self):
        """Load email templates"""
        # In a real implementation, load templates from files
        # self.templates = {}
        # template_dir = os.path.join("templates", "emails")
        # for template_name in os.listdir(template_dir):
        #     with open(os.path.join(template_dir, template_name), "r") as f:
        #         self.templates[template_name] = f.read()
        
        # Mock templates for development
        self.templates = {
            "weekly_report": EmailTemplate(
                subject="Your Weekly Health Report is Ready",
                html_content="""
                <html>
                <body>
                    <h1>Your Weekly Health Report</h1>
                    <p>Hello {first_name},</p>
                    <p>Your weekly health report for {date_range} is now available.</p>
                    <p>Highlights:</p>
                    <ul>
                        {highlights}
                    </ul>
                    <p><a href="{report_url}">View your full report</a></p>
                    <p>Stay healthy!</p>
                    <p>The VitalSign Guardian Team</p>
                </body>
                </html>
                """,
                text_content="""
                Your Weekly Health Report
                
                Hello {first_name},
                
                Your weekly health report for {date_range} is now available.
                
                Highlights:
                {text_highlights}
                
                View your full report: {report_url}
                
                Stay healthy!
                The VitalSign Guardian Team
                """
            ),
            "monthly_report": EmailTemplate(
                subject="Your Monthly Health Analysis is Ready",
                html_content="""
                <html>
                <body>
                    <h1>Your Monthly Health Analysis</h1>
                    <p>Hello {first_name},</p>
                    <p>Your monthly health analysis for {date_range} is now available.</p>
                    <p>Highlights:</p>
                    <ul>
                        {highlights}
                    </ul>
                    <p><a href="{report_url}">View your full report</a></p>
                    <p>Stay healthy!</p>
                    <p>The VitalSign Guardian Team</p>
                </body>
                </html>
                """,
                text_content="""
                Your Monthly Health Analysis
                
                Hello {first_name},
                
                Your monthly health analysis for {date_range} is now available.
                
                Highlights:
                {text_highlights}
                
                View your full report: {report_url}
                
                Stay healthy!
                The VitalSign Guardian Team
                """
            ),
            "quarterly_report": EmailTemplate(
                subject="Your Quarterly Health Review is Ready",
                html_content="""
                <html>
                <body>
                    <h1>Your Quarterly Health Review</h1>
                    <p>Hello {first_name},</p>
                    <p>Your quarterly health review for {date_range} is now available.</p>
                    <p>Highlights:</p>
                    <ul>
                        {highlights}
                    </ul>
                    <p><a href="{report_url}">View your full report</a></p>
                    <p>Stay healthy!</p>
                    <p>The VitalSign Guardian Team</p>
                </body>
                </html>
                """,
                text_content="""
                Your Quarterly Health Review
                
                Hello {first_name},
                
                Your quarterly health review for {date_range} is now available.
                
                Highlights:
                {text_highlights}
                
                View your full report: {report_url}
                
                Stay healthy!
                The VitalSign Guardian Team
                """
            ),
            "health_alert": EmailTemplate(
                subject="Health Alert: Abnormal Pattern Detected",
                html_content="""
                <html>
                <body>
                    <h1>Health Alert</h1>
                    <p>Hello {first_name},</p>
                    <p>We've detected an abnormal pattern in your health data that you should be aware of.</p>
                    <p><strong>{alert_message}</strong></p>
                    <p>Recommendations:</p>
                    <ul>
                        {recommendations}
                    </ul>
                    <p><a href="{dashboard_url}">View your dashboard</a></p>
                    <p>This is an automated alert. Please consult with a healthcare professional for medical advice.</p>
                    <p>The VitalSign Guardian Team</p>
                </body>
                </html>
                """,
                text_content="""
                Health Alert
                
                Hello {first_name},
                
                We've detected an abnormal pattern in your health data that you should be aware of.
                
                {alert_message}
                
                Recommendations:
                {text_recommendations}
                
                View your dashboard: {dashboard_url}
                
                This is an automated alert. Please consult with a healthcare professional for medical advice.
                
                The VitalSign Guardian Team
                """
            ),
            "recommendation": EmailTemplate(
                subject="Your Personalized Health Recommendations",
                html_content="""
                <html>
                <body>
                    <h1>Your Personalized Health Recommendations</h1>
                    <p>Hello {first_name},</p>
                    <p>Based on your recent health data, we have some personalized recommendations for you:</p>
                    <ul>
                        {recommendations}
                    </ul>
                    <p><a href="{dashboard_url}">View your dashboard</a></p>
                    <p>Stay healthy!</p>
                    <p>The VitalSign Guardian Team</p>
                </body>
                </html>
                """,
                text_content="""
                Your Personalized Health Recommendations
                
                Hello {first_name},
                
                Based on your recent health data, we have some personalized recommendations for you:
                
                {text_recommendations}
                
                View your dashboard: {dashboard_url}
                
                Stay healthy!
                The VitalSign Guardian Team
                """
            ),
            "reminder": EmailTemplate(
                subject="We Miss You! Time for a Health Check-in",
                html_content="""
                <html>
                <body>
                    <h1>Time for a Health Check-in</h1>
                    <p>Hello {first_name},</p>
                    <p>It's been a while since you last checked in with VitalSign Guardian. Regular monitoring is key to maintaining good health.</p>
                    <p>Take a moment to log in and update your health data.</p>
                    <p><a href="{login_url}">Log in now</a></p>
                    <p>Stay healthy!</p>
                    <p>The VitalSign Guardian Team</p>
                </body>
                </html>
                """,
                text_content="""
                Time for a Health Check-in
                
                Hello {first_name},
                
                It's been a while since you last checked in with VitalSign Guardian. Regular monitoring is key to maintaining good health.
                
                Take a moment to log in and update your health data.
                
                Log in now: {login_url}
                
                Stay healthy!
                The VitalSign Guardian Team
                """
            )
        }
    
    async def send_report_email(self, email: EmailStr, report: Any, user: Any = None):
        """Send a report email to a user"""
        # In a real implementation, fetch user if not provided
        # if user is None:
        #     user = await self.db.get_user_by_email(email)
        
        # Mock user for development
        if user is None:
            user = {
                "first_name": "John",
                "last_name": "Doe",
                "email": email
            }
        
        # Get the appropriate template
        template = self.templates.get(f"{report.type}_report")
        if not template:
            template = self.templates["weekly_report"]  # Default to weekly
        
        # Format date range
        today = datetime.now().date()
        if report.type == "weekly":
            date_range = f"{(today - timedelta(days=7)).strftime('%b %d')} - {today.strftime('%b %d, %Y')}"
        elif report.type == "monthly":
            date_range = f"{(today.replace(day=1)).strftime('%B %Y')}"
        else:  # quarterly
            quarter = (today.month - 1) // 3 + 1
            date_range = f"Q{quarter} {today.year}"
        
        # Format highlights
        highlights_html = "".join([f"<li>{highlight}</li>" for highlight in report.highlights]) if report.highlights else ""
        text_highlights = "\n".join([f"- {highlight}" for highlight in report.highlights]) if report.highlights else ""
        
        # Format the email content
        report_url = f"https://vitalsignguardian.com/reports/{report.id}"
        html_content = template.html_content.format(
            first_name=user["first_name"],
            date_range=date_range,
            highlights=highlights_html,
            report_url=report_url
        )
        text_content = template.text_content.format(
            first_name=user["first_name"],
            date_range=date_range,
            text_highlights=text_highlights,
            report_url=report_url
        )
        
        # Send the email
        await self._send_email(
            to_email=email,
            subject=template.subject,
            html_content=html_content,
            text_content=text_content
        )
        
        return True
    
    async def send_health_alert(self, email: EmailStr, alert_data: Dict[str, Any], user: Any = None):
        """Send a health alert email"""
        # Mock user for development
        if user is None:
            user = {
                "first_name": "John",
                "last_name": "Doe",
                "email": email
            }
        
        template = self.templates["health_alert"]
        
        # Format recommendations
        recommendations_html = "".join([f"<li>{rec}</li>" for rec in alert_data["recommendations"]])
        text_recommendations = "\n".join([f"- {rec}" for rec in alert_data["recommendations"]])
        
        # Format the email content
        dashboard_url = "https://vitalsignguardian.com/dashboard"
        html_content = template.html_content.format(
            first_name=user["first_name"],
            alert_message=alert_data["message"],
            recommendations=recommendations_html,
            dashboard_url=dashboard_url
        )
        text_content = template.text_content.format(
            first_name=user["first_name"],
            alert_message=alert_data["message"],
            text_recommendations=text_recommendations,
            dashboard_url=dashboard_url
        )
        
        # Send the email
        await self._send_email(
            to_email=email,
            subject=template.subject,
            html_content=html_content,
            text_content=text_content
        )
        
        return True
    
    async def send_recommendation_email(self, email: EmailStr, recommendations: List[str], user: Any = None):
        """Send a personalized recommendations email"""
        # Mock user for development
        if user is None:
            user = {
                "first_name": "John",
                "last_name": "Doe",
                "email": email
            }
        
        template = self.templates["recommendation"]
        
        # Format recommendations
        recommendations_html = "".join([f"<li>{rec}</li>" for rec in recommendations])
        text_recommendations = "\n".join([f"- {rec}" for rec in recommendations])
        
        # Format the email content
        dashboard_url = "https://vitalsignguardian.com/dashboard"
        html_content = template.html_content.format(
            first_name=user["first_name"],
            recommendations=recommendations_html,
            dashboard_url=dashboard_url
        )
        text_content = template.text_content.format(
            first_name=user["first_name"],
            text_recommendations=text_recommendations,
            dashboard_url=dashboard_url
        )
        
        # Send the email
        await self._send_email(
            to_email=email,
            subject=template.subject,
            html_content=html_content,
            text_content=text_content
        )
        
        return True
    
    async def send_reminder_email(self, email: EmailStr, user: Any = None):
        """Send a reminder email to a user who hasn't logged in recently"""
        # Mock user for development
        if user is None:
            user = {
                "first_name": "John",
                "last_name": "Doe",
                "email": email
            }
        
        template = self.templates["reminder"]
        
        # Format the email content
        login_url = "https://vitalsignguardian.com/login"
        html_content = template.html_content.format(
            first_name=user["first_name"],
            login_url=login_url
        )
        text_content = template.text_content.format(
            first_name=user["first_name"],
            login_url=login_url
        )
        
        # Send the email
        await self._send_email(
            to_email=email,
            subject=template.subject,
            html_content=html_content,
            text_content=text_content
        )
        
        return True
    
    async def _send_email(self, to_email: EmailStr, subject: str, html_content: str, text_content: str):
        """Send an email using Resend email service"""
        try:
            # Send email using Resend
            params = {
                "from": "VitalSign Guardian <health@vitalsignguardian.com>",
                "to": [to_email],
                "subject": subject,
                "html": html_content,
                "text": text_content,
            }
            
            # For production, uncomment the following line
            # response = resend.Emails.send(params)
            
            # For development, just print the email
            print(f"Sending email via Resend to: {to_email}")
            print(f"Subject: {subject}")
            print(f"Content: {html_content[:100]}...")
            print(f"Using Resend API key: {self.api_key[:5]}...")
            
            return True
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            # In production, you might want to log this error or raise it
            return False