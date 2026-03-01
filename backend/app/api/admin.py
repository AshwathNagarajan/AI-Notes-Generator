from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List
import logging
from datetime import datetime
import hashlib

from app.core.database import get_collection
from app.models.user import UserResponse

logger = logging.getLogger(__name__)
router = APIRouter()

# Admin credentials (hashed password)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = hashlib.sha256("thinkink3137".encode()).hexdigest()

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    message: str
    admin_token: str
    admin_username: str

class AdminUserStats(BaseModel):
    total_users: int
    active_users: int
    inactive_users: int
    created_today: int
    last_7_days: int

class UserActivityLog(BaseModel):
    user_id: str
    email: str
    display_name: Optional[str]
    feature: str
    created_at: datetime

class AdminDashboardData(BaseModel):
    stats: AdminUserStats
    recent_activities: List
    users_list: List

def verify_admin_token(token: str) -> bool:
    """Verify admin token."""
    # Simple token verification - in production, use JWT
    return token == hashlib.sha256(f"{ADMIN_USERNAME}{ADMIN_PASSWORD_HASH}".encode()).hexdigest()

def get_admin_token() -> str:
    """Generate admin token."""
    return hashlib.sha256(f"{ADMIN_USERNAME}{ADMIN_PASSWORD_HASH}".encode()).hexdigest()

@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(request: AdminLoginRequest):
    """Admin login endpoint."""
    try:
        # Verify credentials
        if request.username != ADMIN_USERNAME:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        password_hash = hashlib.sha256(request.password.encode()).hexdigest()
        if password_hash != ADMIN_PASSWORD_HASH:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Generate token
        admin_token = get_admin_token()
        
        return AdminLoginResponse(
            message="Admin login successful",
            admin_token=admin_token,
            admin_username=ADMIN_USERNAME
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Admin login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.get("/dashboard/stats")
async def get_dashboard_stats(admin_token: str):
    """Get user statistics for admin dashboard."""
    try:
        if not verify_admin_token(admin_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin token"
            )
        
        users_collection = get_collection("users")
        
        # Get all users
        all_users = await users_collection.find({}).to_list(length=None)
        total_users = len(all_users)
        
        # Count active users (logged in within last 7 days)
        from datetime import timedelta
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        active_users = await users_collection.count_documents(
            {"last_login": {"$gte": seven_days_ago}}
        )
        
        inactive_users = total_users - active_users
        
        # Count users created today
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        created_today = await users_collection.count_documents(
            {"created_at": {"$gte": today_start}}
        )
        
        # Count users created in last 7 days
        last_7_days = await users_collection.count_documents(
            {"created_at": {"$gte": seven_days_ago}}
        )
        
        return AdminUserStats(
            total_users=total_users,
            active_users=active_users,
            inactive_users=inactive_users,
            created_today=created_today,
            last_7_days=last_7_days
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get statistics"
        )

@router.get("/users")
async def get_all_users(admin_token: str, skip: int = 0, limit: int = 50):
    """Get all users for admin dashboard."""
    try:
        if not verify_admin_token(admin_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin token"
            )
        
        users_collection = get_collection("users")
        
        # Get users with pagination
        users = await users_collection.find({}).skip(skip).limit(limit).to_list(length=None)
        
        # Convert ObjectId to string
        for user in users:
            user["_id"] = str(user["_id"])
        
        total_users = await users_collection.count_documents({})
        
        return {
            "users": users,
            "total_users": total_users,
            "skip": skip,
            "limit": limit
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting users: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get users"
        )

@router.get("/activities")
async def get_user_activities(admin_token: str, limit: int = 100):
    """Get recent user activities."""
    try:
        if not verify_admin_token(admin_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin token"
            )
        
        history_collection = get_collection("history")
        
        # Get recent activities
        activities = await history_collection.find({}).sort("created_at", -1).limit(limit).to_list(length=None)
        
        # Convert ObjectId to string
        for activity in activities:
            activity["_id"] = str(activity["_id"])
        
        return {
            "activities": activities,
            "total": len(activities)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting activities: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get activities"
        )

@router.get("/user/{user_id}/activities")
async def get_user_activity_history(user_id: str, admin_token: str, limit: int = 50):
    """Get activity history for a specific user."""
    try:
        if not verify_admin_token(admin_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin token"
            )
        
        history_collection = get_collection("history")
        
        # Get user activities
        activities = await history_collection.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(limit).to_list(length=None)
        
        # Convert ObjectId to string
        for activity in activities:
            activity["_id"] = str(activity["_id"])
        
        # Count different feature types
        feature_counts = {}
        for activity in activities:
            feature_type = activity.get("feature_type", "unknown")
            feature_counts[feature_type] = feature_counts.get(feature_type, 0) + 1
        
        return {
            "user_id": user_id,
            "activities": activities,
            "total": len(activities),
            "feature_breakdown": feature_counts
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user activity history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user activity history"
        )

@router.get("/analytics")
async def get_analytics(admin_token: str):
    """Get detailed analytics and insights."""
    try:
        if not verify_admin_token(admin_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin token"
            )
        
        history_collection = get_collection("history")
        
        # Get feature usage breakdown
        feature_pipeline = [
            {
                "$group": {
                    "_id": "$feature_type",
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {"count": -1}
            }
        ]
        
        feature_stats = await history_collection.aggregate(feature_pipeline).to_list(length=None)
        
        # Format feature stats
        feature_usage = {stat["_id"]: stat["count"] for stat in feature_stats}
        
        # Get status breakdown
        status_pipeline = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            }
        ]
        
        status_stats = await history_collection.aggregate(status_pipeline).to_list(length=None)
        status_breakdown = {stat["_id"]: stat["count"] for stat in status_stats}
        
        return {
            "feature_usage": feature_usage,
            "status_breakdown": status_breakdown,
            "total_activities": sum(feature_usage.values())
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting analytics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get analytics"
        )
