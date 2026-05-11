import os
from datetime import datetime
from functools import wraps
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AppError(Exception):
    """Custom application error"""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

def safe_operation(func):
    """Decorator for safe operations with error handling"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except AppError as e:
            logger.error(f"App error in {func.__name__}: {e.message}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {str(e)}")
            raise AppError("An unexpected error occurred", 500)
    return wrapper

def sanitize_input(text: str) -> str:
    """Sanitize user input"""
    return text.strip()[:1000]  # Max 1000 characters

def validate_complaint_text(text: str) -> bool:
    """Validate complaint text"""
    return bool(text and len(text.strip()) >= 10)

def validate_location(location: str) -> bool:
    """Validate location"""
    return bool(location and len(location.strip()) >= 2)

def get_request_ip(request) -> str:
    """Get client IP from request"""
    if request.headers.get('x-forwarded-for'):
        return request.headers.get('x-forwarded-for').split(',')[0].strip()
    return request.client.host if request.client else "Unknown"

def format_response(data: dict, status: str = "success"):
    """Format API response"""
    return {
        "status": status,
        "data": data,
        "timestamp": datetime.utcnow().isoformat()
    }

def create_error_response(message: str, error_code: str = "ERROR"):
    """Create error response"""
    return {
        "status": "error",
        "message": message,
        "error_code": error_code,
        "timestamp": datetime.utcnow().isoformat()
    }
